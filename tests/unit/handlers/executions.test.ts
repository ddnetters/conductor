import { jest } from "@jest/globals";
import { ExecutionHandlers } from "../../../src/handlers/executions.js";
import type { N8nClient } from "../../../src/client/n8n.js";
import type { N8nExecution, ListExecutionsQuery } from "../../../src/types.js";

describe("ExecutionHandlers", () => {
  let executionHandlers: ExecutionHandlers;
  let mockN8nClient: jest.Mocked<N8nClient>;

  beforeEach(() => {
    mockN8nClient = {
      listExecutions: jest.fn(),
      getExecution: jest.fn(),
      deleteExecution: jest.fn(),
    } as any;

    executionHandlers = new ExecutionHandlers(mockN8nClient);
  });

  describe("listExecutions", () => {
    it("should return formatted execution list", async () => {
      const mockExecutions: N8nExecution[] = [
        {
          id: "exec-1",
          workflowId: "workflow-1",
          mode: "manual",
          status: "success",
          startedAt: "2023-01-01T10:00:00Z",
          finishedAt: "2023-01-01T10:01:00Z",
          data: { result: "completed" },
        },
        {
          id: "exec-2",
          workflowId: "workflow-2",
          mode: "trigger",
          status: "error",
          startedAt: "2023-01-01T11:00:00Z",
          finishedAt: "2023-01-01T11:01:00Z",
          error: "Node execution failed",
        },
      ];

      mockN8nClient.listExecutions.mockResolvedValue(mockExecutions);

      const result = await executionHandlers.listExecutions({});

      expect(mockN8nClient.listExecutions).toHaveBeenCalledWith({});
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: JSON.stringify(mockExecutions, null, 2),
          },
        ],
      });
    });

    it("should pass query parameters to client", async () => {
      const query: ListExecutionsQuery = {
        workflowId: "workflow-1",
        status: "success",
        limit: 50,
        offset: 10,
        includeData: true,
      };

      mockN8nClient.listExecutions.mockResolvedValue([]);

      await executionHandlers.listExecutions(query);

      expect(mockN8nClient.listExecutions).toHaveBeenCalledWith(query);
    });

    it("should handle different status filters", async () => {
      const statusValues: N8nExecution["status"][] = ["running", "success", "error", "waiting", "canceled"];

      for (const status of statusValues) {
        mockN8nClient.listExecutions.mockClear();
        mockN8nClient.listExecutions.mockResolvedValue([]);

        await executionHandlers.listExecutions({ status });

        expect(mockN8nClient.listExecutions).toHaveBeenCalledWith({ status });
      }
    });

    it("should handle client errors", async () => {
      const error = new Error("API Error");
      mockN8nClient.listExecutions.mockRejectedValue(error);

      const result = await executionHandlers.listExecutions({});

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Error listing executions: Error: API Error",
          },
        ],
      });
    });

    it("should handle empty execution list", async () => {
      mockN8nClient.listExecutions.mockResolvedValue([]);

      const result = await executionHandlers.listExecutions({});

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "[]",
          },
        ],
      });
    });
  });

  describe("getExecution", () => {
    it("should return specific execution with full details", async () => {
      const mockExecution: N8nExecution = {
        id: "exec-1",
        workflowId: "workflow-1",
        mode: "manual",
        status: "success",
        startedAt: "2023-01-01T10:00:00Z",
        finishedAt: "2023-01-01T10:01:00Z",
        data: {
          resultData: {
            runData: {
              "Manual Trigger": [
                {
                  hints: [],
                  main: [
                    [
                      {
                        json: { message: "Hello World" },
                        pairedItem: { item: 0 },
                      },
                    ],
                  ],
                  metadata: {
                    subRun: [
                      {
                        node: "Manual Trigger",
                        runIndex: 0,
                      },
                    ],
                  },
                  source: [null],
                  startTime: 1672574400000,
                  executionTime: 1,
                },
              ],
            },
          },
        },
      };

      mockN8nClient.getExecution.mockResolvedValue(mockExecution);

      const result = await executionHandlers.getExecution({ executionId: "exec-1" });

      expect(mockN8nClient.getExecution).toHaveBeenCalledWith("exec-1");
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: JSON.stringify(mockExecution, null, 2),
          },
        ],
      });
    });

    it("should handle running execution", async () => {
      const mockExecution: N8nExecution = {
        id: "exec-running",
        workflowId: "workflow-1",
        mode: "webhook",
        status: "running",
        startedAt: "2023-01-01T10:00:00Z",
        // No finishedAt for running execution
      };

      mockN8nClient.getExecution.mockResolvedValue(mockExecution);

      const result = await executionHandlers.getExecution({ executionId: "exec-running" });

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: JSON.stringify(mockExecution, null, 2),
          },
        ],
      });
    });

    it("should handle execution not found", async () => {
      const error = new Error("Execution not found");
      mockN8nClient.getExecution.mockRejectedValue(error);

      const result = await executionHandlers.getExecution({ executionId: "nonexistent" });

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Error getting execution: Error: Execution not found",
          },
        ],
      });
    });

    it("should handle executions with errors", async () => {
      const mockExecution: N8nExecution = {
        id: "exec-error",
        workflowId: "workflow-1",
        mode: "trigger",
        status: "error",
        startedAt: "2023-01-01T10:00:00Z",
        finishedAt: "2023-01-01T10:00:30Z",
        error: "Node 'HTTP Request' failed: Request failed with status code 404",
        data: {
          resultData: {
            error: {
              message: "Request failed with status code 404",
              name: "NodeApiError",
              node: {
                name: "HTTP Request",
                type: "n8n-nodes-base.httpRequest",
              },
            },
          },
        },
      };

      mockN8nClient.getExecution.mockResolvedValue(mockExecution);

      const result = await executionHandlers.getExecution({ executionId: "exec-error" });

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: JSON.stringify(mockExecution, null, 2),
          },
        ],
      });
    });
  });

  describe("deleteExecution", () => {
    it("should delete execution successfully", async () => {
      mockN8nClient.deleteExecution.mockResolvedValue(undefined);

      const result = await executionHandlers.deleteExecution({ executionId: "exec-1" });

      expect(mockN8nClient.deleteExecution).toHaveBeenCalledWith("exec-1");
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Execution exec-1 deleted successfully",
          },
        ],
      });
    });

    it("should handle deletion errors", async () => {
      const error = new Error("Cannot delete running execution");
      mockN8nClient.deleteExecution.mockRejectedValue(error);

      const result = await executionHandlers.deleteExecution({ executionId: "exec-running" });

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Error deleting execution: Error: Cannot delete running execution",
          },
        ],
      });
    });

    it("should handle execution not found for deletion", async () => {
      const error = new Error("Execution not found");
      mockN8nClient.deleteExecution.mockRejectedValue(error);

      const result = await executionHandlers.deleteExecution({ executionId: "nonexistent" });

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Error deleting execution: Error: Execution not found",
          },
        ],
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle non-Error exceptions in listExecutions", async () => {
      mockN8nClient.listExecutions.mockRejectedValue("String error");

      const result = await executionHandlers.listExecutions({});

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Error listing executions: String error",
          },
        ],
      });
    });

    it("should handle null/undefined errors in getExecution", async () => {
      mockN8nClient.getExecution.mockRejectedValue(null);

      const result = await executionHandlers.getExecution({ executionId: "test" });

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Error getting execution: null",
          },
        ],
      });
    });

    it("should handle network timeouts", async () => {
      const timeoutError = new Error("Request timeout");
      timeoutError.name = "TimeoutError";
      mockN8nClient.listExecutions.mockRejectedValue(timeoutError);

      const result = await executionHandlers.listExecutions({});

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Error listing executions: TimeoutError: Request timeout",
          },
        ],
      });
    });
  });

  describe("Data Formatting", () => {
    it("should properly format complex execution data", async () => {
      const complexExecution: N8nExecution = {
        id: "exec-complex",
        workflowId: "workflow-complex",
        mode: "manual",
        status: "success",
        startedAt: "2023-01-01T10:00:00Z",
        finishedAt: "2023-01-01T10:02:30Z",
        data: {
          resultData: {
            runData: {
              "Manual Trigger": [
                {
                  hints: [],
                  main: [[{ json: { id: 1, name: "Item 1" } }]],
                  metadata: { subRun: [] },
                  source: [null],
                  startTime: 1672574400000,
                  executionTime: 5,
                },
              ],
              "Set": [
                {
                  hints: [],
                  main: [[{ json: { id: 1, name: "Modified Item 1", processed: true } }]],
                  metadata: { subRun: [] },
                  source: [{ previousNode: "Manual Trigger" }],
                  startTime: 1672574405000,
                  executionTime: 10,
                },
              ],
            },
          },
        },
      };

      mockN8nClient.getExecution.mockResolvedValue(complexExecution);

      const result = await executionHandlers.getExecution({ executionId: "exec-complex" });

      expect(result.content[0]?.text).toContain('"status": "success"');
      expect(result.content[0]?.text).toContain('"processed": true');
      expect(result.content[0]?.text).toContain('"Manual Trigger"');
      expect(result.content[0]?.text).toContain('"Set"');
    });

    it("should handle executions with minimal data", async () => {
      const minimalExecution: N8nExecution = {
        id: "exec-minimal",
        workflowId: "workflow-1",
        mode: "webhook",
        status: "waiting",
        startedAt: "2023-01-01T10:00:00Z",
      };

      mockN8nClient.getExecution.mockResolvedValue(minimalExecution);

      const result = await executionHandlers.getExecution({ executionId: "exec-minimal" });

      expect(result.content[0]?.text).toContain('"status": "waiting"');
      expect(result.content[0]?.text).toContain('"mode": "webhook"');
      expect(result.content[0]?.text).not.toContain('"finishedAt"');
      expect(result.content[0]?.text).not.toContain('"data"');
    });
  });
});