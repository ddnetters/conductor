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
  private maxRetries = 3;
  private retryDelay = 1000; // 1 second base delay

  constructor() {
    this.client = axios.create({
      baseURL: config.n8n.apiUrl,
      headers: {
        "X-N8N-API-KEY": config.n8n.apiKey,
        "Content-Type": "application/json",
      },
      timeout: 30000,
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        console.log(`[N8N API] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error("[N8N API] Request error:", error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => {
        console.log(
          `[N8N API] ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`
        );
        return response;
      },
      (error) => {
        console.error(
          `[N8N API] Error: ${error.response?.status} ${error.config?.method?.toUpperCase()} ${error.config?.url}`
        );
        throw this.handleError(error);
      }
    );
  }

  // Retry wrapper for transient failures
  private async withRetry<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: any;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        lastError = error;

        // Don't retry on client errors (4xx) except 429 (rate limit)
        if (
          error.statusCode &&
          error.statusCode >= 400 &&
          error.statusCode < 500 &&
          error.statusCode !== 429
        ) {
          throw error;
        }

        // Don't retry on last attempt
        if (attempt === this.maxRetries) {
          throw error;
        }

        // Exponential backoff
        const delay = this.retryDelay * Math.pow(2, attempt);
        console.log(`[N8N API] Retrying in ${delay}ms (attempt ${attempt + 1}/${this.maxRetries})`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }

  // Workflow operations
  async listWorkflows(query?: ListWorkflowsQuery): Promise<N8nWorkflow[]> {
    return this.withRetry(async () => {
      const params = new URLSearchParams();

      if (query?.active !== undefined) {
        params.append("active", query.active.toString());
      }
      if (query?.tags) {
        query.tags.forEach((tag) => params.append("tags", tag));
      }
      if (query?.limit) {
        params.append("limit", query.limit.toString());
      }
      if (query?.offset) {
        params.append("offset", query.offset.toString());
      }

      const response = await this.client.get(`/workflows?${params.toString()}`);
      return response.data.data || response.data;
    });
  }

  async getWorkflow(id: string): Promise<N8nWorkflow> {
    return this.withRetry(async () => {
      const response = await this.client.get(`/workflows/${id}`);
      return response.data;
    });
  }

  async createWorkflow(workflow: CreateWorkflowRequest): Promise<N8nWorkflow> {
    return this.withRetry(async () => {
      const response = await this.client.post("/workflows", workflow);
      return response.data;
    });
  }

  async updateWorkflow(id: string, workflow: UpdateWorkflowRequest): Promise<N8nWorkflow> {
    return this.withRetry(async () => {
      const response = await this.client.put(`/workflows/${id}`, workflow);
      return response.data;
    });
  }

  async deleteWorkflow(id: string): Promise<void> {
    return this.withRetry(async () => {
      await this.client.delete(`/workflows/${id}`);
    });
  }

  async activateWorkflow(id: string): Promise<N8nWorkflow> {
    return this.withRetry(async () => {
      const response = await this.client.post(`/workflows/${id}/activate`);
      return response.data;
    });
  }

  async deactivateWorkflow(id: string): Promise<N8nWorkflow> {
    return this.withRetry(async () => {
      const response = await this.client.post(`/workflows/${id}/deactivate`);
      return response.data;
    });
  }

  // Execution operations
  async listExecutions(query?: ListExecutionsQuery): Promise<N8nExecution[]> {
    return this.withRetry(async () => {
      const params = new URLSearchParams();

      if (query?.workflowId) {
        params.append("workflowId", query.workflowId);
      }
      if (query?.status) {
        params.append("status", query.status);
      }
      if (query?.limit) {
        params.append("limit", query.limit.toString());
      }
      if (query?.offset) {
        params.append("offset", query.offset.toString());
      }
      if (query?.includeData !== undefined) {
        params.append("includeData", query.includeData.toString());
      }

      const response = await this.client.get(`/executions?${params.toString()}`);
      return response.data.data || response.data;
    });
  }

  async getExecution(id: string): Promise<N8nExecution> {
    return this.withRetry(async () => {
      const response = await this.client.get(`/executions/${id}`);
      return response.data;
    });
  }

  async deleteExecution(id: string): Promise<void> {
    return this.withRetry(async () => {
      await this.client.delete(`/executions/${id}`);
    });
  }

  // Webhook operations
  async runWebhook(workflowName: string, data?: WebhookExecutionRequest): Promise<any> {
    return this.withRetry(async () => {
      const url = `/webhook/${workflowName}`;
      const headers = data?.headers || {};

      // Use the appropriate HTTP method
      const method = data?.method?.toLowerCase() || "post";

      switch (method) {
        case "get":
          return (await this.client.get(url, { headers })).data;
        case "post":
          return (await this.client.post(url, data?.data, { headers })).data;
        case "put":
          return (await this.client.put(url, data?.data, { headers })).data;
        case "patch":
          return (await this.client.patch(url, data?.data, { headers })).data;
        case "delete":
          return (await this.client.delete(url, { headers })).data;
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }
    });
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await this.withRetry(async () => {
        await this.client.get("/health");
      });
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
