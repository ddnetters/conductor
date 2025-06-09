import { jest } from "@jest/globals";
import { WebhookHandlers } from "../../../src/handlers/webhooks.js";
import type { N8nClient } from "../../../src/client/n8n.js";
import type { WebhookResponse } from "../../../src/types.js";

describe("WebhookHandlers", () => {
  let webhookHandlers: WebhookHandlers;
  let mockN8nClient: jest.Mocked<N8nClient>;

  beforeEach(() => {
    mockN8nClient = {
      runWebhook: jest.fn(),
    } as any;

    webhookHandlers = new WebhookHandlers(mockN8nClient);
  });

  describe("runWebhook", () => {
    it("should execute webhook with minimal parameters", async () => {
      const mockResponse: WebhookResponse = {
        success: true,
        data: { message: "Webhook executed successfully" },
      };

      mockN8nClient.runWebhook.mockResolvedValue(mockResponse);

      const result = await webhookHandlers.runWebhook({
        workflowName: "test-webhook",
      });

      expect(mockN8nClient.runWebhook).toHaveBeenCalledWith("test-webhook", {
        data: undefined,
      });
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: `Webhook executed successfully: ${JSON.stringify(mockResponse, null, 2)}`,
          },
        ],
      });
    });

    it("should execute webhook with data payload", async () => {
      const webhookData = {
        userId: 123,
        action: "user_created",
        timestamp: "2023-01-01T10:00:00Z",
        details: {
          email: "user@example.com",
          name: "John Doe",
        },
      };

      const mockResponse: WebhookResponse = {
        success: true,
        data: {
          processed: true,
          userId: 123,
          workflowExecutionId: "exec-123",
        },
      };

      mockN8nClient.runWebhook.mockResolvedValue(mockResponse);

      const result = await webhookHandlers.runWebhook({
        workflowName: "user-webhook",
        data: webhookData,
      });

      expect(mockN8nClient.runWebhook).toHaveBeenCalledWith("user-webhook", {
        data: webhookData,
      });
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: `Webhook executed successfully: ${JSON.stringify(mockResponse, null, 2)}`,
          },
        ],
      });
    });

    it("should execute webhook with custom headers", async () => {
      const customHeaders = {
        "X-API-Key": "secret-key",
        "Content-Type": "application/json",
        "User-Agent": "n8n-mcp-client/1.0",
      };

      const mockResponse: WebhookResponse = {
        success: true,
        message: "Processed with custom headers",
      };

      mockN8nClient.runWebhook.mockResolvedValue(mockResponse);

      const result = await webhookHandlers.runWebhook({
        workflowName: "auth-webhook",
        headers: customHeaders,
      });

      expect(mockN8nClient.runWebhook).toHaveBeenCalledWith("auth-webhook", {
        data: undefined,
        headers: customHeaders,
      });
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: `Webhook executed successfully: ${JSON.stringify(mockResponse, null, 2)}`,
          },
        ],
      });
    });

    it("should execute webhook with both data and headers", async () => {
      const webhookData = {
        event: "payment_completed",
        amount: 99.99,
        currency: "USD",
        customer_id: "cust_123",
      };

      const customHeaders = {
        "X-Webhook-Source": "payment-processor",
        "X-Signature": "sha256=abc123def456",
      };

      const mockResponse: WebhookResponse = {
        success: true,
        data: {
          payment_processed: true,
          invoice_id: "inv_456",
          execution_id: "exec_789",
        },
      };

      mockN8nClient.runWebhook.mockResolvedValue(mockResponse);

      const result = await webhookHandlers.runWebhook({
        workflowName: "payment-webhook",
        data: webhookData,
        headers: customHeaders,
      });

      expect(mockN8nClient.runWebhook).toHaveBeenCalledWith("payment-webhook", {
        data: webhookData,
        headers: customHeaders,
      });
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: `Webhook executed successfully: ${JSON.stringify(mockResponse, null, 2)}`,
          },
        ],
      });
    });

    it("should handle webhook execution with empty response", async () => {
      mockN8nClient.runWebhook.mockResolvedValue({});

      const result = await webhookHandlers.runWebhook({
        workflowName: "empty-response-webhook",
      });

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Webhook executed successfully: {}",
          },
        ],
      });
    });

    it("should handle webhook execution with string response", async () => {
      const stringResponse = "Plain text response";
      mockN8nClient.runWebhook.mockResolvedValue(stringResponse as any);

      const result = await webhookHandlers.runWebhook({
        workflowName: "text-response-webhook",
      });

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: `Webhook executed successfully: ${JSON.stringify(stringResponse, null, 2)}`,
          },
        ],
      });
    });

    it("should handle complex nested data structures", async () => {
      const complexData = {
        metadata: {
          version: "1.0",
          source: "api",
          processed_at: new Date().toISOString(),
        },
        payload: {
          items: [
            { id: 1, name: "Item 1", tags: ["urgent", "priority"] },
            { id: 2, name: "Item 2", tags: ["normal"] },
          ],
          totals: {
            count: 2,
            value: 150.75,
            tax: 15.08,
          },
        },
        options: {
          send_email: true,
          notify_slack: false,
          create_ticket: true,
        },
      };

      const mockResponse: WebhookResponse = {
        success: true,
        data: {
          items_processed: 2,
          notifications_sent: ["email"],
          ticket_id: "TK-789",
        },
      };

      mockN8nClient.runWebhook.mockResolvedValue(mockResponse);

      const result = await webhookHandlers.runWebhook({
        workflowName: "complex-data-webhook",
        data: complexData,
      });

      expect(mockN8nClient.runWebhook).toHaveBeenCalledWith("complex-data-webhook", {
        data: complexData,
      });
      expect(result.content[0]?.text).toContain('"items_processed": 2');
      expect(result.content[0]?.text).toContain('"ticket_id": "TK-789"');
    });
  });

  describe("Error Handling", () => {
    it("should handle webhook not found errors", async () => {
      const error = new Error("Webhook 'nonexistent-webhook' not found");
      mockN8nClient.runWebhook.mockRejectedValue(error);

      const result = await webhookHandlers.runWebhook({
        workflowName: "nonexistent-webhook",
      });

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Error executing webhook: Error: Webhook 'nonexistent-webhook' not found",
          },
        ],
      });
    });

    it("should handle workflow not active errors", async () => {
      const error = new Error("Workflow is not active");
      mockN8nClient.runWebhook.mockRejectedValue(error);

      const result = await webhookHandlers.runWebhook({
        workflowName: "inactive-webhook",
      });

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Error executing webhook: Error: Workflow is not active",
          },
        ],
      });
    });

    it("should handle network connection errors", async () => {
      const networkError = new Error("Network connection failed");
      networkError.name = "NetworkError";
      mockN8nClient.runWebhook.mockRejectedValue(networkError);

      const result = await webhookHandlers.runWebhook({
        workflowName: "test-webhook",
      });

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Error executing webhook: NetworkError: Network connection failed",
          },
        ],
      });
    });

    it("should handle timeout errors", async () => {
      const timeoutError = new Error("Request timeout after 30000ms");
      timeoutError.name = "TimeoutError";
      mockN8nClient.runWebhook.mockRejectedValue(timeoutError);

      const result = await webhookHandlers.runWebhook({
        workflowName: "slow-webhook",
      });

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Error executing webhook: TimeoutError: Request timeout after 30000ms",
          },
        ],
      });
    });

    it("should handle authentication errors", async () => {
      const authError = new Error("Unauthorized: Invalid API key");
      authError.name = "AuthenticationError";
      mockN8nClient.runWebhook.mockRejectedValue(authError);

      const result = await webhookHandlers.runWebhook({
        workflowName: "protected-webhook",
      });

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Error executing webhook: AuthenticationError: Unauthorized: Invalid API key",
          },
        ],
      });
    });

    it("should handle non-Error exceptions", async () => {
      mockN8nClient.runWebhook.mockRejectedValue("String error");

      const result = await webhookHandlers.runWebhook({
        workflowName: "test-webhook",
      });

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Error executing webhook: String error",
          },
        ],
      });
    });

    it("should handle null/undefined errors", async () => {
      mockN8nClient.runWebhook.mockRejectedValue(null);

      const result = await webhookHandlers.runWebhook({
        workflowName: "test-webhook",
      });

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Error executing webhook: null",
          },
        ],
      });
    });
  });

  describe("Response Formatting", () => {
    it("should properly format webhook response with arrays", async () => {
      const mockResponse: WebhookResponse = {
        success: true,
        data: {
          processed_items: ["item1", "item2", "item3"],
          failed_items: [],
          summary: {
            total: 3,
            success: 3,
            failed: 0,
          },
        },
      };

      mockN8nClient.runWebhook.mockResolvedValue(mockResponse);

      const result = await webhookHandlers.runWebhook({
        workflowName: "batch-webhook",
      });

      expect(result.content[0]?.text).toContain('"processed_items": [');
      expect(result.content[0]?.text).toContain('"item1"');
      expect(result.content[0]?.text).toContain('"failed_items": []');
      expect(result.content[0]?.text).toContain('"total": 3');
    });

    it("should handle webhook response with error status", async () => {
      const mockResponse: WebhookResponse = {
        success: false,
        error: "Validation failed: missing required field 'email'",
        data: {
          validation_errors: [
            { field: "email", message: "Email is required" },
            { field: "email", message: "Email must be valid format" },
          ],
        },
      };

      mockN8nClient.runWebhook.mockResolvedValue(mockResponse);

      const result = await webhookHandlers.runWebhook({
        workflowName: "validation-webhook",
        data: { name: "John" }, // Missing email
      });

      expect(result.content[0]?.text).toContain('"success": false');
      expect(result.content[0]?.text).toContain('"error": "Validation failed');
      expect(result.content[0]?.text).toContain('"validation_errors"');
    });

    it("should handle very large webhook responses", async () => {
      const largeData = {
        items: Array.from({ length: 100 }, (_, i) => ({
          id: i + 1,
          name: `Item ${i + 1}`,
          description: `This is a description for item ${i + 1}`.repeat(10),
          metadata: {
            created: new Date().toISOString(),
            tags: [`tag${i % 5}`, `category${i % 3}`],
          },
        })),
      };

      const mockResponse: WebhookResponse = {
        success: true,
        data: largeData,
      };

      mockN8nClient.runWebhook.mockResolvedValue(mockResponse);

      const result = await webhookHandlers.runWebhook({
        workflowName: "large-data-webhook",
      });

      expect(result.content[0]?.text).toContain('"success": true');
      expect(result.content[0]?.text).toContain('"items"');
      expect(result.content[0]?.text.length).toBeGreaterThan(1000); // Should be a substantial response
    });
  });
});