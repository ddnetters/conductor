// n8n API Types and Interfaces

export interface N8nConfig {
  apiUrl: string;
  apiKey: string;
}

export interface N8nWorkflow {
  id: string;
  name: string;
  active: boolean;
  nodes: N8nNode[];
  connections: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  settings?: Record<string, unknown>;
}

export interface N8nNode {
  id: string;
  name: string;
  type: string;
  typeVersion: number;
  position: [number, number];
  parameters: Record<string, unknown>;
}

export interface N8nExecution {
  id: string;
  workflowId: string;
  mode: "manual" | "trigger" | "webhook" | "retry";
  status: "running" | "success" | "error" | "waiting" | "canceled";
  startedAt: string;
  finishedAt?: string;
  data?: Record<string, unknown>;
  error?: string;
}

export interface CreateWorkflowRequest {
  name: string;
  nodes: N8nNode[];
  connections: Record<string, unknown>;
  active?: boolean;
  tags?: string[];
  settings?: Record<string, unknown>;
}

export interface UpdateWorkflowRequest {
  name?: string;
  nodes?: N8nNode[];
  connections?: Record<string, unknown>;
  active?: boolean;
  tags?: string[];
  settings?: Record<string, unknown>;
}

export interface ListWorkflowsQuery {
  active?: boolean;
  tags?: string[];
  limit?: number;
  offset?: number;
}

export interface ListExecutionsQuery {
  workflowId?: string;
  status?: N8nExecution["status"];
  limit?: number;
  offset?: number;
  includeData?: boolean;
}

export interface WebhookExecutionRequest {
  data?: Record<string, unknown>;
  headers?: Record<string, string>;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
}

// Error types
export interface N8nError {
  message: string;
  code?: string | undefined;
  statusCode?: number | undefined;
  details?: Record<string, unknown> | undefined;
}

// Webhook response type
export interface WebhookResponse {
  success?: boolean;
  data?: unknown;
  message?: string;
  error?: string;
}

// Generic error from axios or other sources
export interface GenericError {
  message: string;
  response?: {
    status: number;
    data?: {
      message?: string;
      code?: string;
    };
  };
  request?: unknown;
  statusCode?: number;
  details?: Record<string, unknown>;
}

// N8nClient configuration options
export interface N8nClientOptions {
  maxRetries?: number;
  retryDelay?: number;
  enableLogging?: boolean;
}

// MCP Tool response types
export interface ToolResponse {
  content: Array<{
    type: "text";
    text: string;
  }>;
  _meta?: { [key: string]: unknown };
}
