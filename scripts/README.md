# Test Scripts

## Manual N8n Client Testing

The `test-n8n-client.ts` script allows you to quickly test the N8nClient against your actual n8n server to verify that all API calls work correctly in practice.

### Prerequisites

1. **Running n8n Server**: You need a running n8n instance (local or remote)
2. **API Key**: Generate an API key in your n8n instance:
   - Go to your n8n instance
   - Navigate to Settings → API Keys
   - Create a new API key

### Setup

1. **Set Environment Variables**:
   ```bash
   export N8N_API_URL="http://localhost:5678"  # Your n8n server URL
   export N8N_API_KEY="your-api-key-here"     # Your n8n API key
   ```

   Or create a `.env` file in the project root:
   ```env
   N8N_API_URL=http://localhost:5678
   N8N_API_KEY=your-api-key-here
   ```

2. **Run the Test**:
   ```bash
   npm run test:manual
   ```

### What the Test Does

The test script will:

1. ✅ **Health Check** - Verify connection to your n8n server
2. ✅ **List Workflows** - Fetch existing workflows (up to 5)
3. ✅ **Create Workflow** - Create a simple test workflow with Start and Set nodes
4. ✅ **Get Workflow** - Retrieve the created workflow by ID
5. ✅ **Update Workflow** - Modify the workflow name and tags
6. ✅ **Activate Workflow** - Activate the test workflow
7. ✅ **Deactivate Workflow** - Deactivate the test workflow
8. ✅ **List Executions** - Fetch recent executions (up to 5)
9. ✅ **Get Execution** - Retrieve execution details (if any exist)
10. ✅ **Test Webhook** - Try webhook execution (if webhook workflows exist)
11. ✅ **Delete Workflow** - Clean up by deleting the test workflow

### Expected Output

```
🚀 Testing N8nClient against real n8n server...

📋 Configuration:
   API URL: http://localhost:5678
   API Key: ***key4

🏥 Testing health check...
   Health check: ✅ Healthy

📄 Testing list workflows...
   Found 3 workflows
   First workflow: "My First Workflow" (ID: 1, Active: true)

➕ Testing create workflow...
   Created workflow: "Test Workflow - 2023-12-07T10:30:00.000Z" (ID: 4)

📖 Testing get workflow...
   Retrieved workflow: "Test Workflow - 2023-12-07T10:30:00.000Z" (Active: false)

✏️  Testing update workflow...
   Updated workflow name: "Test Workflow - 2023-12-07T10:30:00.000Z - Updated"

🟢 Testing activate workflow...
   Activated workflow: ✅ Active

🔴 Testing deactivate workflow...
   Deactivated workflow: ✅ Deactivated

📊 Testing list executions...
   Found 2 executions
   Latest execution: 123 (Status: success, Workflow: 1)

📈 Testing get execution...
   Retrieved execution: 123 (Status: success)

🗑️  Cleaning up test workflow...
   Deleted test workflow: 4

✅ All tests completed successfully!
```

### Troubleshooting

**Connection Issues:**
- Verify your n8n server is running and accessible
- Check that the `N8N_API_URL` is correct
- Ensure your API key is valid and has the necessary permissions

**Permission Issues:**
- Make sure your API key has sufficient permissions
- Some operations may require admin privileges

**Network Issues:**
- Check firewall settings
- Verify CORS settings if testing against a remote server

### What This Validates

This test validates that:
- Your n8n server is accessible
- API authentication is working
- All CRUD operations for workflows function correctly
- Execution listing and retrieval work
- Error handling is functioning
- The client handles real-world API responses correctly