#!/usr/bin/env tsx

/**
 * Manual test script for the N8nClient against a real n8n instance
 * 
 * Usage:
 *   npm run test:manual
 * 
 * Make sure to set your environment variables:
 *   N8N_API_URL=http://your-n8n-server:5678
 *   N8N_API_KEY=your-api-key
 */

import { N8nClient } from '../src/client/n8n';
import { config } from '../src/config';
import type { CreateWorkflowRequest } from '../src/types';

async function testN8nClient() {
  console.log('🚀 Testing N8nClient against real n8n server...\n');
  
  // Validate configuration
  console.log('📋 Configuration:');
  console.log(`   API URL: ${config.n8n.apiUrl}`);
  console.log(`   API Key: ${config.n8n.apiKey ? '***' + config.n8n.apiKey.slice(-4) : 'NOT SET'}\n`);
  
  if (!config.n8n.apiUrl || !config.n8n.apiKey) {
    console.error('❌ Missing N8N_API_URL or N8N_API_KEY environment variables');
    process.exit(1);
  }

  const client = new N8nClient({
    enableLogging: true,
    maxRetries: 2,
    retryDelay: 1000
  });

  try {
    // Test 1: Health Check
    console.log('🏥 Testing health check...');
    const isHealthy = await client.healthCheck();
    console.log(`   Health check: ${isHealthy ? '✅ Healthy' : '❌ Unhealthy'}\n`);
    
    if (!isHealthy) {
      console.error('❌ Server is not healthy. Check your N8N_API_URL and N8N_API_KEY');
      return;
    }

    // Test 2: List Workflows
    console.log('📄 Testing list workflows...');
    const workflows = await client.listWorkflows({ limit: 5 });
    console.log(`   Found ${workflows.length} workflows`);
    if (workflows.length > 0) {
      console.log(`   First workflow: "${workflows[0].name}" (ID: ${workflows[0].id}, Active: ${workflows[0].active})`);
    }
    console.log();

    // Test 3: Create a Test Workflow
    console.log('➕ Testing create workflow...');
    const testWorkflow: CreateWorkflowRequest = {
      name: `Test Workflow - ${new Date().toISOString()}`,
      active: false,
      nodes: [
        {
          id: 'start',
          name: 'Start',
          type: 'n8n-nodes-base.start',
          typeVersion: 1,
          position: [240, 300],
          parameters: {}
        },
        {
          id: 'set',
          name: 'Set',
          type: 'n8n-nodes-base.set',
          typeVersion: 1,
          position: [460, 300],
          parameters: {
            values: {
              string: [
                {
                  name: 'message',
                  value: 'Hello from N8nClient test!'
                }
              ]
            }
          }
        }
      ],
      connections: {
        Start: {
          main: [
            [
              {
                node: 'Set',
                type: 'main',
                index: 0
              }
            ]
          ]
        }
      },
      tags: ['test', 'n8n-mcp-server']
    };

    const createdWorkflow = await client.createWorkflow(testWorkflow);
    console.log(`   Created workflow: "${createdWorkflow.name}" (ID: ${createdWorkflow.id})`);
    const workflowId = createdWorkflow.id;

    // Test 4: Get Workflow
    console.log('\n📖 Testing get workflow...');
    const retrievedWorkflow = await client.getWorkflow(workflowId);
    console.log(`   Retrieved workflow: "${retrievedWorkflow.name}" (Active: ${retrievedWorkflow.active})`);

    // Test 5: Update Workflow
    console.log('\n✏️  Testing update workflow...');
    const updatedWorkflow = await client.updateWorkflow(workflowId, {
      name: `${testWorkflow.name} - Updated`,
      tags: ['test', 'n8n-mcp-server', 'updated']
    });
    console.log(`   Updated workflow name: "${updatedWorkflow.name}"`);

    // Test 6: Activate Workflow
    console.log('\n🟢 Testing activate workflow...');
    const activatedWorkflow = await client.activateWorkflow(workflowId);
    console.log(`   Activated workflow: ${activatedWorkflow.active ? '✅ Active' : '❌ Not Active'}`);

    // Test 7: Deactivate Workflow
    console.log('\n🔴 Testing deactivate workflow...');
    const deactivatedWorkflow = await client.deactivateWorkflow(workflowId);
    console.log(`   Deactivated workflow: ${deactivatedWorkflow.active ? '❌ Still Active' : '✅ Deactivated'}`);

    // Test 8: List Executions
    console.log('\n📊 Testing list executions...');
    const executions = await client.listExecutions({ limit: 5 });
    console.log(`   Found ${executions.length} executions`);
    if (executions.length > 0) {
      const exec = executions[0];
      console.log(`   Latest execution: ${exec.id} (Status: ${exec.status}, Workflow: ${exec.workflowId})`);
      
      // Test 9: Get Execution
      console.log('\n📈 Testing get execution...');
      const retrievedExecution = await client.getExecution(exec.id);
      console.log(`   Retrieved execution: ${retrievedExecution.id} (Status: ${retrievedExecution.status})`);
    }

    // Test 10: Test Webhook (if you have a webhook workflow)
    if (workflows.some(w => w.nodes.some(n => n.type === 'n8n-nodes-base.webhook'))) {
      console.log('\n🪝 Testing webhook...');
      try {
        // This will likely fail unless you have a specific webhook workflow set up
        const webhookResult = await client.runWebhook('test-webhook', {
          method: 'POST',
          data: { test: 'data' }
        });
        console.log('   Webhook result:', webhookResult);
      } catch (error: any) {
        console.log(`   Webhook test failed (expected if no webhook workflow exists): ${error.message}`);
      }
    }

    // Cleanup: Delete Test Workflow
    console.log('\n🗑️  Cleaning up test workflow...');
    await client.deleteWorkflow(workflowId);
    console.log(`   Deleted test workflow: ${workflowId}`);

    console.log('\n✅ All tests completed successfully!');
    console.log('\n📊 Test Summary:');
    console.log('   ✅ Health Check');
    console.log('   ✅ List Workflows');  
    console.log('   ✅ Create Workflow');
    console.log('   ✅ Get Workflow');
    console.log('   ✅ Update Workflow');
    console.log('   ✅ Activate Workflow');
    console.log('   ✅ Deactivate Workflow');
    console.log('   ✅ List Executions');
    if (executions.length > 0) {
      console.log('   ✅ Get Execution');
    }
    console.log('   ✅ Delete Workflow');

  } catch (error: any) {
    console.error('\n❌ Test failed with error:');
    console.error('   Message:', error.message);
    if (error.code) {
      console.error('   Code:', error.code);
    }
    if (error.statusCode) {
      console.error('   Status Code:', error.statusCode);
    }
    if (error.details) {
      console.error('   Details:', JSON.stringify(error.details, null, 2));
    }
    process.exit(1);
  }
}

// Run the test
testN8nClient().catch(console.error);