import { jest } from "@jest/globals";
import { WorkflowHandlers } from "../../../src/handlers/workflows.js";
import type { N8nClient } from "../../../src/client/n8n.js";
import type { N8nWorkflow, CreateWorkflowRequest, ListWorkflowsQuery } from "../../../src/types.js";

describe("WorkflowHandlers", () => {
  let workflowHandlers: WorkflowHandlers;
  let mockN8nClient: jest.Mocked<N8nClient>;

  beforeEach(() => {
    mockN8nClient = {
      listWorkflows: jest.fn(),
      getWorkflow: jest.fn(),
      createWorkflow: jest.fn(),
      updateWorkflow: jest.fn(),
      deleteWorkflow: jest.fn(),
      activateWorkflow: jest.fn(),
      deactivateWorkflow: jest.fn(),
    } as any;

    workflowHandlers = new WorkflowHandlers(mockN8nClient);
  });

  describe("listWorkflows", () => {
    it("should return formatted workflow list", async () => {
      const mockWorkflows: N8nWorkflow[] = [
        {
          id: "1",
          name: "Test Workflow 1",
          active: true,
          nodes: [],
          connections: {},
          createdAt: "2023-01-01T00:00:00Z",
          updatedAt: "2023-01-01T00:00:00Z",
        },
        {
          id: "2", 
          name: "Test Workflow 2",
          active: false,
          nodes: [],
          connections: {},
          createdAt: "2023-01-02T00:00:00Z",
          updatedAt: "2023-01-02T00:00:00Z",
        },
      ];

      mockN8nClient.listWorkflows.mockResolvedValue(mockWorkflows);

      const result = await workflowHandlers.listWorkflows({});

      expect(mockN8nClient.listWorkflows).toHaveBeenCalledWith({});
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: JSON.stringify(mockWorkflows, null, 2),
          },
        ],
      });
    });

    it("should pass query parameters to client", async () => {
      const query: ListWorkflowsQuery = {
        active: true,
        tags: ["automation"],
        limit: 10,
        offset: 0,
      };

      mockN8nClient.listWorkflows.mockResolvedValue([]);

      await workflowHandlers.listWorkflows(query);

      expect(mockN8nClient.listWorkflows).toHaveBeenCalledWith(query);
    });

    it("should handle client errors", async () => {
      const error = new Error("API Error");
      mockN8nClient.listWorkflows.mockRejectedValue(error);

      const result = await workflowHandlers.listWorkflows({});

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Error listing workflows: Error: API Error",
          },
        ],
      });
    });
  });

  describe("getWorkflow", () => {
    it("should return specific workflow", async () => {
      const mockWorkflow: N8nWorkflow = {
        id: "workflow-1",
        name: "Test Workflow",
        active: true,
        nodes: [
          {
            id: "node-1",
            name: "Manual Trigger",
            type: "n8n-nodes-base.manualTrigger",
            typeVersion: 1,
            position: [250, 300],
            parameters: {},
          },
        ],
        connections: {},
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z",
        tags: ["test"],
      };

      mockN8nClient.getWorkflow.mockResolvedValue(mockWorkflow);

      const result = await workflowHandlers.getWorkflow({ workflowId: "workflow-1" });

      expect(mockN8nClient.getWorkflow).toHaveBeenCalledWith("workflow-1");
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: JSON.stringify(mockWorkflow, null, 2),
          },
        ],
      });
    });

    it("should handle workflow not found", async () => {
      const error = new Error("Workflow not found");
      mockN8nClient.getWorkflow.mockRejectedValue(error);

      const result = await workflowHandlers.getWorkflow({ workflowId: "nonexistent" });

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Error getting workflow: Error: Workflow not found",
          },
        ],
      });
    });
  });

  describe("createWorkflow", () => {
    it("should create workflow successfully", async () => {
      const workflowData: CreateWorkflowRequest = {
        name: "New Workflow",
        nodes: [
          {
            id: "node-1",
            name: "Manual Trigger", 
            type: "n8n-nodes-base.manualTrigger",
            typeVersion: 1,
            position: [250, 300],
            parameters: {},
          },
        ],
        connections: {},
        active: false,
        tags: ["automation"],
      };

      const createdWorkflow: N8nWorkflow = {
        id: "new-workflow-id",
        name: workflowData.name,
        nodes: workflowData.nodes,
        connections: workflowData.connections,
        active: workflowData.active || false,
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z",
        ...(workflowData.tags && { tags: workflowData.tags }),
        ...(workflowData.settings && { settings: workflowData.settings }),
      };

      mockN8nClient.createWorkflow.mockResolvedValue(createdWorkflow);

      const result = await workflowHandlers.createWorkflow(workflowData);

      expect(mockN8nClient.createWorkflow).toHaveBeenCalledWith(workflowData);
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: `Workflow created successfully: ${JSON.stringify(createdWorkflow, null, 2)}`,
          },
        ],
      });
    });

    it("should handle creation errors", async () => {
      const workflowData: CreateWorkflowRequest = {
        name: "Invalid Workflow",
        nodes: [],
        connections: {},
      };

      const error = new Error("Invalid workflow structure");
      mockN8nClient.createWorkflow.mockRejectedValue(error);

      const result = await workflowHandlers.createWorkflow(workflowData);

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Error creating workflow: Error: Invalid workflow structure",
          },
        ],
      });
    });
  });

  describe("updateWorkflow", () => {
    it("should update workflow successfully", async () => {
      const updateData = {
        workflowId: "workflow-1",
        name: "Updated Workflow Name",
        active: true,
      };

      const updatedWorkflow: N8nWorkflow = {
        id: "workflow-1",
        name: "Updated Workflow Name",
        active: true,
        nodes: [],
        connections: {},
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-02T00:00:00Z",
      };

      mockN8nClient.updateWorkflow.mockResolvedValue(updatedWorkflow);

      const result = await workflowHandlers.updateWorkflow(updateData);

      expect(mockN8nClient.updateWorkflow).toHaveBeenCalledWith("workflow-1", {
        name: "Updated Workflow Name",
        active: true,
      });
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: `Workflow updated successfully: ${JSON.stringify(updatedWorkflow, null, 2)}`,
          },
        ],
      });
    });

    it("should handle update errors", async () => {
      const updateData = {
        workflowId: "workflow-1",
        name: "Updated Name",
      };

      const error = new Error("Workflow not found");
      mockN8nClient.updateWorkflow.mockRejectedValue(error);

      const result = await workflowHandlers.updateWorkflow(updateData);

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Error updating workflow: Error: Workflow not found",
          },
        ],
      });
    });
  });

  describe("deleteWorkflow", () => {
    it("should delete workflow successfully", async () => {
      mockN8nClient.deleteWorkflow.mockResolvedValue({} as any);

      const result = await workflowHandlers.deleteWorkflow({ workflowId: "workflow-1" });

      expect(mockN8nClient.deleteWorkflow).toHaveBeenCalledWith("workflow-1");
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Workflow workflow-1 deleted successfully",
          },
        ],
      });
    });

    it("should handle deletion errors", async () => {
      const error = new Error("Cannot delete active workflow");
      mockN8nClient.deleteWorkflow.mockRejectedValue(error);

      const result = await workflowHandlers.deleteWorkflow({ workflowId: "workflow-1" });

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Error deleting workflow: Error: Cannot delete active workflow",
          },
        ],
      });
    });
  });

  describe("activateWorkflow", () => {
    it("should activate workflow successfully", async () => {
      mockN8nClient.activateWorkflow.mockResolvedValue({} as any);

      const result = await workflowHandlers.activateWorkflow({ workflowId: "workflow-1" });

      expect(mockN8nClient.activateWorkflow).toHaveBeenCalledWith("workflow-1");
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Workflow workflow-1 activated successfully",
          },
        ],
      });
    });

    it("should handle activation errors", async () => {
      const error = new Error("Workflow already active");
      mockN8nClient.activateWorkflow.mockRejectedValue(error);

      const result = await workflowHandlers.activateWorkflow({ workflowId: "workflow-1" });

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Error activating workflow: Error: Workflow already active",
          },
        ],
      });
    });
  });

  describe("deactivateWorkflow", () => {
    it("should deactivate workflow successfully", async () => {
      mockN8nClient.deactivateWorkflow.mockResolvedValue({} as any);

      const result = await workflowHandlers.deactivateWorkflow({ workflowId: "workflow-1" });

      expect(mockN8nClient.deactivateWorkflow).toHaveBeenCalledWith("workflow-1");
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Workflow workflow-1 deactivated successfully",
          },
        ],
      });
    });

    it("should handle deactivation errors", async () => {
      const error = new Error("Workflow already inactive");
      mockN8nClient.deactivateWorkflow.mockRejectedValue(error);

      const result = await workflowHandlers.deactivateWorkflow({ workflowId: "workflow-1" });

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Error deactivating workflow: Error: Workflow already inactive",
          },
        ],
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle non-Error exceptions", async () => {
      mockN8nClient.listWorkflows.mockRejectedValue("String error");

      const result = await workflowHandlers.listWorkflows({});

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Error listing workflows: String error",
          },
        ],
      });
    });

    it("should handle null/undefined errors", async () => {
      mockN8nClient.getWorkflow.mockRejectedValue(null);

      const result = await workflowHandlers.getWorkflow({ workflowId: "test" });

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Error getting workflow: null",
          },
        ],
      });
    });
  });
});