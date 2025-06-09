#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import dotenv from "dotenv";

import { N8nClient } from "./client/n8n.js";
import { WorkflowHandlers } from "./handlers/workflows.js";
import { ExecutionHandlers } from "./handlers/executions.js";
import { WebhookHandlers } from "./handlers/webhooks.js";
import { loadConfig } from "./config.js";
import { logger } from "./utils/logger.js";

// Load environment variables
dotenv.config();

// Initialize n8n client and handlers
let n8nClient: N8nClient;
let workflowHandlers: WorkflowHandlers;
let executionHandlers: ExecutionHandlers;
let webhookHandlers: WebhookHandlers;

try {
  // Load config to validate environment variables
  loadConfig();
  n8nClient = new N8nClient({
    enableLogging: true,
  });
  workflowHandlers = new WorkflowHandlers(n8nClient);
  executionHandlers = new ExecutionHandlers(n8nClient);
  webhookHandlers = new WebhookHandlers(n8nClient);
  logger.info("n8n client and handlers initialized successfully");
} catch (error) {
  logger.error("Failed to initialize n8n client:", error);
  process.exit(1);
}

const server = new Server(
  {
    name: "n8n-mcp-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Input validation schemas
const listWorkflowsSchema = z.object({
  active: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  limit: z.number().int().positive().optional(),
  offset: z.number().int().min(0).optional(),
});

const getWorkflowSchema = z.object({
  workflowId: z.string().min(1),
});

const createWorkflowSchema = z.object({
  name: z.string().min(1),
  nodes: z.array(z.any()),
  connections: z.record(z.unknown()),
  active: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  settings: z.record(z.unknown()).optional(),
});

const updateWorkflowSchema = z.object({
  workflowId: z.string().min(1),
  name: z.string().min(1).optional(),
  nodes: z.array(z.any()).optional(),
  connections: z.record(z.unknown()).optional(),
  active: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  settings: z.record(z.unknown()).optional(),
});

const deleteWorkflowSchema = z.object({
  workflowId: z.string().min(1),
});

const activateWorkflowSchema = z.object({
  workflowId: z.string().min(1),
});

const deactivateWorkflowSchema = z.object({
  workflowId: z.string().min(1),
});

const listExecutionsSchema = z.object({
  workflowId: z.string().optional(),
  status: z.enum(["running", "success", "error", "waiting", "canceled"]).optional(),
  limit: z.number().int().positive().optional(),
  offset: z.number().int().min(0).optional(),
  includeData: z.boolean().optional(),
});

const getExecutionSchema = z.object({
  executionId: z.string().min(1),
});

const deleteExecutionSchema = z.object({
  executionId: z.string().min(1),
});

const runWebhookSchema = z.object({
  workflowName: z.string().min(1),
  data: z.record(z.unknown()).optional(),
  headers: z.record(z.string()).optional(),
});

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "list_workflows",
        description: "Retrieve a list of all workflows available in n8n",
        inputSchema: {
          type: "object",
          properties: {
            active: {
              type: "boolean",
              description: "Filter workflows by active status",
            },
            tags: {
              type: "array",
              items: { type: "string" },
              description: "Filter workflows by tags",
            },
            limit: {
              type: "number",
              description: "Maximum number of workflows to return",
            },
            offset: {
              type: "number",
              description: "Number of workflows to skip for pagination",
            },
          },
        },
      },
      {
        name: "get_workflow",
        description: "Retrieve a specific workflow by ID",
        inputSchema: {
          type: "object",
          properties: {
            workflowId: {
              type: "string",
              description: "ID of the workflow to retrieve",
            },
          },
          required: ["workflowId"],
        },
      },
      {
        name: "create_workflow",
        description: "Create a new workflow in n8n",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Name of the workflow",
            },
            nodes: {
              type: "array",
              description: "Array of node objects that define the workflow",
              items: { type: "object" },
            },
            connections: {
              type: "object",
              description: "Connection mappings between nodes",
            },
            active: {
              type: "boolean",
              description: "Whether the workflow should be active upon creation",
            },
            tags: {
              type: "array",
              items: { type: "string" },
              description: "Tags to associate with the workflow",
            },
          },
          required: ["name"],
        },
      },
      {
        name: "update_workflow",
        description: "Update an existing workflow in n8n",
        inputSchema: {
          type: "object",
          properties: {
            workflowId: {
              type: "string",
              description: "ID of the workflow to update",
            },
            name: {
              type: "string",
              description: "New name for the workflow",
            },
            nodes: {
              type: "array",
              description: "Updated array of node objects that define the workflow",
              items: { type: "object" },
            },
            connections: {
              type: "object",
              description: "Updated connection mappings between nodes",
            },
            active: {
              type: "boolean",
              description: "Whether the workflow should be active",
            },
            tags: {
              type: "array",
              items: { type: "string" },
              description: "Updated tags to associate with the workflow",
            },
          },
          required: ["workflowId"],
        },
      },
      {
        name: "delete_workflow",
        description: "Delete a workflow from n8n",
        inputSchema: {
          type: "object",
          properties: {
            workflowId: {
              type: "string",
              description: "ID of the workflow to delete",
            },
          },
          required: ["workflowId"],
        },
      },
      {
        name: "activate_workflow",
        description: "Activate a workflow in n8n",
        inputSchema: {
          type: "object",
          properties: {
            workflowId: {
              type: "string",
              description: "ID of the workflow to activate",
            },
          },
          required: ["workflowId"],
        },
      },
      {
        name: "deactivate_workflow",
        description: "Deactivate a workflow in n8n",
        inputSchema: {
          type: "object",
          properties: {
            workflowId: {
              type: "string",
              description: "ID of the workflow to deactivate",
            },
          },
          required: ["workflowId"],
        },
      },
      {
        name: "list_executions",
        description: "Retrieve a list of workflow executions from n8n",
        inputSchema: {
          type: "object",
          properties: {
            workflowId: {
              type: "string",
              description: "Optional ID of workflow to filter executions by",
            },
            status: {
              type: "string",
              enum: ["running", "success", "error", "waiting", "canceled"],
              description: "Optional status to filter by (success, error, waiting, or canceled)",
            },
            limit: {
              type: "number",
              description: "Maximum number of executions to return",
            },
            offset: {
              type: "number",
              description: "Number of executions to skip for pagination",
            },
            includeData: {
              type: "boolean",
              description: "Include execution data in response",
            },
          },
        },
      },
      {
        name: "get_execution",
        description: "Retrieve detailed information about a specific workflow execution",
        inputSchema: {
          type: "object",
          properties: {
            executionId: {
              type: "string",
              description: "ID of the execution to retrieve",
            },
          },
          required: ["executionId"],
        },
      },
      {
        name: "delete_execution",
        description: "Delete a specific workflow execution from n8n",
        inputSchema: {
          type: "object",
          properties: {
            executionId: {
              type: "string",
              description: "ID of the execution to delete",
            },
          },
          required: ["executionId"],
        },
      },
      {
        name: "run_webhook",
        description: "Execute a workflow via webhook with optional input data",
        inputSchema: {
          type: "object",
          properties: {
            workflowName: {
              type: "string",
              description: 'Name of the workflow to execute (e.g., "hello-world")',
            },
            data: {
              type: "object",
              description: "Input data to pass to the webhook",
            },
            headers: {
              type: "object",
              description: "Additional headers to send with the request",
            },
          },
          required: ["workflowName"],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    logger.info(`Tool called: ${name}`, { args });

    switch (name) {
      case "list_workflows": {
        const validatedArgs = listWorkflowsSchema.parse(args || {});
        return await workflowHandlers.listWorkflows(validatedArgs);
      }

      case "get_workflow": {
        const validatedArgs = getWorkflowSchema.parse(args);
        return await workflowHandlers.getWorkflow(validatedArgs);
      }

      case "create_workflow": {
        const validatedArgs = createWorkflowSchema.parse(args);
        return await workflowHandlers.createWorkflow(validatedArgs);
      }

      case "update_workflow": {
        const validatedArgs = updateWorkflowSchema.parse(args);
        return await workflowHandlers.updateWorkflow(validatedArgs);
      }

      case "delete_workflow": {
        const validatedArgs = deleteWorkflowSchema.parse(args);
        return await workflowHandlers.deleteWorkflow(validatedArgs);
      }

      case "activate_workflow": {
        const validatedArgs = activateWorkflowSchema.parse(args);
        return await workflowHandlers.activateWorkflow(validatedArgs);
      }

      case "deactivate_workflow": {
        const validatedArgs = deactivateWorkflowSchema.parse(args);
        return await workflowHandlers.deactivateWorkflow(validatedArgs);
      }

      case "list_executions": {
        const validatedArgs = listExecutionsSchema.parse(args || {});
        return await executionHandlers.listExecutions(validatedArgs);
      }

      case "get_execution": {
        const validatedArgs = getExecutionSchema.parse(args);
        return await executionHandlers.getExecution(validatedArgs);
      }

      case "delete_execution": {
        const validatedArgs = deleteExecutionSchema.parse(args);
        return await executionHandlers.deleteExecution(validatedArgs);
      }

      case "run_webhook": {
        const validatedArgs = runWebhookSchema.parse(args);
        return await webhookHandlers.runWebhook(validatedArgs);
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    logger.error(`Error handling tool call ${name}:`, error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return {
        content: [
          {
            type: "text",
            text: `Input validation error: ${error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join(", ")}`,
          },
        ],
      };
    }

    // Handle other errors
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
    };
  }
});

async function main() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    logger.info("n8n MCP server running on stdio");
    console.error("n8n MCP server running on stdio");
  } catch (error) {
    logger.error("Failed to start server:", error);
    throw error;
  }
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  logger.info("Received SIGINT, shutting down gracefully");
  process.exit(0);
});

process.on("SIGTERM", () => {
  logger.info("Received SIGTERM, shutting down gracefully");
  process.exit(0);
});

main().catch((error) => {
  logger.error("Server error:", error);
  console.error("Server error:", error);
  process.exit(1);
});
