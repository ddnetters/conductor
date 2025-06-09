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
  connections: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  settings?: Record<string, any>;
}

export interface N8nNode {
  id: string;
  name: string;
  type: string;
  typeVersion: number;
  position: [number, number];
  parameters: Record<string, any>;
}

export interface N8nExecution {
  id: string;
  workflowId: string;
  mode: "manual" | "trigger" | "webhook" | "retry";
  status: "running" | "success" | "error" | "waiting" | "canceled";
  startedAt: string;
  finishedAt?: string;
  data?: Record<string, any>;
  error?: string;
}

export interface CreateWorkflowRequest {
  name: string;
  nodes: N8nNode[];
  connections: Record<string, any>;
  active?: boolean;
  tags?: string[];
  settings?: Record<string, any>;
}

export interface UpdateWorkflowRequest {
  name?: string;
  nodes?: N8nNode[];
  connections?: Record<string, any>;
  active?: boolean;
  tags?: string[];
  settings?: Record<string, any>;
}

export interface ListWorkflowsQuery {
  active?: boolean;
  tags?: string[];
}

export interface ListExecutionsQuery {
  workflowId?: string;
  status?: N8nExecution["status"];
  limit?: number;
  offset?: number;
}

export interface WebhookExecutionRequest {
  data?: Record<string, any>;
  headers?: Record<string, string>;
}

// Error types
export interface N8nError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: Record<string, any>;
}

// MCP Tool response types
export interface ToolResponse {
  content: Array<{
    type: "text";
    text: string;
  }>;
}
