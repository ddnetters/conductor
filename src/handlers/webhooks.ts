import { N8nClient } from "../client/n8n.js";
import type { ToolResponse } from "../types.js";

export class WebhookHandlers {
  constructor(private client: N8nClient) {}

  async runWebhook(args: { workflowName: string; data?: any; headers?: Record<string, string> }): Promise<ToolResponse> {
    try {
      // TODO: Implement run webhook
      const result = await this.client.runWebhook(args.workflowName, {
        data: args.data,
        headers: args.headers,
      });
      
      return {
        content: [
          {
            type: "text",
            text: `Webhook executed successfully: ${JSON.stringify(result, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error executing webhook: ${error}`,
          },
        ],
      };
    }
  }
}