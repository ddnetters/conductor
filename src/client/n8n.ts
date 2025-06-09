import axios, { AxiosInstance } from "axios";
import { config } from "../config.js";
import type {
  N8nWorkflow,
  N8nExecution,
  CreateWorkflowRequest,
  UpdateWorkflowRequest,
  ListWorkflowsQuery,
  ListExecutionsQuery,
  WebhookExecutionRequest,
  N8nError,
} from "../types.js";

export class N8nClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: config.n8n.apiUrl,
      headers: {
        "X-N8N-API-KEY": config.n8n.apiKey,
        "Content-Type": "application/json",
      },
      timeout: 30000,
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        throw this.handleError(error);
      }
    );
  }

  // Workflow operations
  async listWorkflows(_query?: ListWorkflowsQuery): Promise<N8nWorkflow[]> {
    // TODO: Implement actual API call
    throw new Error("Not implemented yet");
  }

  async getWorkflow(_id: string): Promise<N8nWorkflow> {
    // TODO: Implement actual API call
    throw new Error("Not implemented yet");
  }

  async createWorkflow(_workflow: CreateWorkflowRequest): Promise<N8nWorkflow> {
    // TODO: Implement actual API call
    throw new Error("Not implemented yet");
  }

  async updateWorkflow(_id: string, _workflow: UpdateWorkflowRequest): Promise<N8nWorkflow> {
    // TODO: Implement actual API call
    throw new Error("Not implemented yet");
  }

  async deleteWorkflow(_id: string): Promise<void> {
    // TODO: Implement actual API call
    throw new Error("Not implemented yet");
  }

  async activateWorkflow(_id: string): Promise<N8nWorkflow> {
    // TODO: Implement actual API call
    throw new Error("Not implemented yet");
  }

  async deactivateWorkflow(_id: string): Promise<N8nWorkflow> {
    // TODO: Implement actual API call
    throw new Error("Not implemented yet");
  }

  // Execution operations
  async listExecutions(_query?: ListExecutionsQuery): Promise<N8nExecution[]> {
    // TODO: Implement actual API call
    throw new Error("Not implemented yet");
  }

  async getExecution(_id: string): Promise<N8nExecution> {
    // TODO: Implement actual API call
    throw new Error("Not implemented yet");
  }

  async deleteExecution(_id: string): Promise<void> {
    // TODO: Implement actual API call
    throw new Error("Not implemented yet");
  }

  // Webhook operations
  async runWebhook(_workflowName: string, _data?: WebhookExecutionRequest): Promise<any> {
    // TODO: Implement actual API call
    throw new Error("Not implemented yet");
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      // TODO: Implement actual health check endpoint
      return true;
    } catch {
      return false;
    }
  }

  private handleError(error: any): N8nError {
    if (error.response) {
      // HTTP error response
      return {
        message: error.response.data?.message || error.message,
        code: error.response.data?.code,
        statusCode: error.response.status,
        details: error.response.data,
      };
    } else if (error.request) {
      // Network error
      return {
        message: "Network error: Unable to connect to n8n",
        code: "NETWORK_ERROR",
      };
    } else {
      // Other error
      return {
        message: error.message || "Unknown error occurred",
        code: "UNKNOWN_ERROR",
      };
    }
  }
}
