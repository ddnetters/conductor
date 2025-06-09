import axios, { AxiosInstance, AxiosResponse } from "axios";
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
  async listWorkflows(query?: ListWorkflowsQuery): Promise<N8nWorkflow[]> {
    // TODO: Implement actual API call
    throw new Error("Not implemented yet");
  }

  async getWorkflow(id: string): Promise<N8nWorkflow> {
    // TODO: Implement actual API call
    throw new Error("Not implemented yet");
  }

  async createWorkflow(workflow: CreateWorkflowRequest): Promise<N8nWorkflow> {
    // TODO: Implement actual API call
    throw new Error("Not implemented yet");
  }

  async updateWorkflow(id: string, workflow: UpdateWorkflowRequest): Promise<N8nWorkflow> {
    // TODO: Implement actual API call
    throw new Error("Not implemented yet");
  }

  async deleteWorkflow(id: string): Promise<void> {
    // TODO: Implement actual API call
    throw new Error("Not implemented yet");
  }

  async activateWorkflow(id: string): Promise<N8nWorkflow> {
    // TODO: Implement actual API call
    throw new Error("Not implemented yet");
  }

  async deactivateWorkflow(id: string): Promise<N8nWorkflow> {
    // TODO: Implement actual API call
    throw new Error("Not implemented yet");
  }

  // Execution operations
  async listExecutions(query?: ListExecutionsQuery): Promise<N8nExecution[]> {
    // TODO: Implement actual API call
    throw new Error("Not implemented yet");
  }

  async getExecution(id: string): Promise<N8nExecution> {
    // TODO: Implement actual API call
    throw new Error("Not implemented yet");
  }

  async deleteExecution(id: string): Promise<void> {
    // TODO: Implement actual API call
    throw new Error("Not implemented yet");
  }

  // Webhook operations
  async runWebhook(workflowName: string, data?: WebhookExecutionRequest): Promise<any> {
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