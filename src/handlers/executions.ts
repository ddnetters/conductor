import { N8nClient } from "../client/n8n.js";
import type { ToolResponse } from "../types.js";

export class ExecutionHandlers {
  constructor(private client: N8nClient) {}

  async listExecutions(args: any): Promise<ToolResponse> {
    try {
      // TODO: Implement list executions
      const executions = await this.client.listExecutions(args);
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(executions, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error listing executions: ${error}`,
          },
        ],
      };
    }
  }

  async getExecution(args: { executionId: string }): Promise<ToolResponse> {
    try {
      // TODO: Implement get execution
      const execution = await this.client.getExecution(args.executionId);
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(execution, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error getting execution: ${error}`,
          },
        ],
      };
    }
  }

  async deleteExecution(args: { executionId: string }): Promise<ToolResponse> {
    try {
      // TODO: Implement delete execution
      await this.client.deleteExecution(args.executionId);
      
      return {
        content: [
          {
            type: "text",
            text: `Execution ${args.executionId} deleted successfully`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error deleting execution: ${error}`,
          },
        ],
      };
    }
  }
}