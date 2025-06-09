import { N8nClient } from "../client/n8n.js";
import type { ToolResponse, ListWorkflowsQuery, CreateWorkflowRequest } from "../types.js";

export class WorkflowHandlers {
  constructor(private client: N8nClient) {}

  async listWorkflows(args: unknown): Promise<ToolResponse> {
    try {
      // TODO: Implement workflow listing
      const workflows = await this.client.listWorkflows(args as ListWorkflowsQuery);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(workflows, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error listing workflows: ${error}`,
          },
        ],
      };
    }
  }

  async getWorkflow(args: { workflowId: string }): Promise<ToolResponse> {
    try {
      // TODO: Implement get workflow
      const workflow = await this.client.getWorkflow(args.workflowId);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(workflow, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error getting workflow: ${error}`,
          },
        ],
      };
    }
  }

  async createWorkflow(args: unknown): Promise<ToolResponse> {
    try {
      // TODO: Implement create workflow
      const workflow = await this.client.createWorkflow(args as CreateWorkflowRequest);

      return {
        content: [
          {
            type: "text",
            text: `Workflow created successfully: ${JSON.stringify(workflow, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error creating workflow: ${error}`,
          },
        ],
      };
    }
  }

  async updateWorkflow(args: {
    workflowId: string;
    [key: string]: unknown;
  }): Promise<ToolResponse> {
    try {
      // TODO: Implement update workflow
      const { workflowId, ...updateData } = args;
      const workflow = await this.client.updateWorkflow(workflowId, updateData);

      return {
        content: [
          {
            type: "text",
            text: `Workflow updated successfully: ${JSON.stringify(workflow, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error updating workflow: ${error}`,
          },
        ],
      };
    }
  }

  async deleteWorkflow(args: { workflowId: string }): Promise<ToolResponse> {
    try {
      // TODO: Implement delete workflow
      await this.client.deleteWorkflow(args.workflowId);

      return {
        content: [
          {
            type: "text",
            text: `Workflow ${args.workflowId} deleted successfully`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error deleting workflow: ${error}`,
          },
        ],
      };
    }
  }

  async activateWorkflow(args: { workflowId: string }): Promise<ToolResponse> {
    try {
      // TODO: Implement activate workflow
      await this.client.activateWorkflow(args.workflowId);

      return {
        content: [
          {
            type: "text",
            text: `Workflow ${args.workflowId} activated successfully`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error activating workflow: ${error}`,
          },
        ],
      };
    }
  }

  async deactivateWorkflow(args: { workflowId: string }): Promise<ToolResponse> {
    try {
      // TODO: Implement deactivate workflow
      await this.client.deactivateWorkflow(args.workflowId);

      return {
        content: [
          {
            type: "text",
            text: `Workflow ${args.workflowId} deactivated successfully`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error deactivating workflow: ${error}`,
          },
        ],
      };
    }
  }
}
