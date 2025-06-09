import { z } from "zod";

// Common validation schemas
export const idSchema = z.string().min(1, "ID is required");

export const workflowIdSchema = idSchema;
export const executionIdSchema = idSchema;

// Workflow validation schemas
export const listWorkflowsSchema = z.object({
  active: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

export const getWorkflowSchema = z.object({
  workflowId: workflowIdSchema,
});

export const createWorkflowSchema = z.object({
  name: z.string().min(1, "Workflow name is required"),
  nodes: z.array(z.any()),
  connections: z.record(z.any()),
  active: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  settings: z.record(z.any()).optional(),
});

export const updateWorkflowSchema = z.object({
  workflowId: workflowIdSchema,
  name: z.string().min(1).optional(),
  nodes: z.array(z.any()).optional(),
  connections: z.record(z.any()).optional(),
  active: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  settings: z.record(z.any()).optional(),
});

export const deleteWorkflowSchema = z.object({
  workflowId: workflowIdSchema,
});

export const activateWorkflowSchema = z.object({
  workflowId: workflowIdSchema,
});

export const deactivateWorkflowSchema = z.object({
  workflowId: workflowIdSchema,
});

// Execution validation schemas
export const listExecutionsSchema = z.object({
  workflowId: workflowIdSchema.optional(),
  status: z.enum(["running", "success", "error", "waiting", "canceled"]).optional(),
  limit: z.number().int().positive().max(100).optional(),
  offset: z.number().int().nonnegative().optional(),
});

export const getExecutionSchema = z.object({
  executionId: executionIdSchema,
});

export const deleteExecutionSchema = z.object({
  executionId: executionIdSchema,
});

// Webhook validation schemas
export const runWebhookSchema = z.object({
  workflowName: z.string().min(1, "Workflow name is required"),
  data: z.record(z.any()).optional(),
  headers: z.record(z.string()).optional(),
});

// Validation helper function
export function validateInput<T>(schema: z.ZodSchema<T>, input: unknown): T {
  try {
    return schema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      throw new Error(`Validation failed: ${errorMessages.join(', ')}`);
    }
    throw error;
  }
}