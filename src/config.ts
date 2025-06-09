import { z } from "zod";

// Configuration schema
const configSchema = z.object({
  n8n: z.object({
    apiUrl: z.string().url().default("http://localhost:5678"),
    apiKey: z.string().min(1, "N8N_API_KEY is required"),
  }),
  server: z.object({
    port: z.number().int().positive().default(3000),
    logLevel: z.enum(["error", "warn", "info", "debug"]).default("info"),
  }),
  nodeEnv: z.enum(["development", "production", "test"]).default("development"),
});

export type Config = z.infer<typeof configSchema>;

// Load and validate configuration
export function loadConfig(): Config {
  const config = {
    n8n: {
      apiUrl: process.env.N8N_API_URL || "http://localhost:5678",
      apiKey: process.env.N8N_API_KEY || "",
    },
    server: {
      port: parseInt(process.env.PORT || "3000", 10),
      logLevel: (process.env.LOG_LEVEL as any) || "info",
    },
    nodeEnv: (process.env.NODE_ENV as any) || "development",
  };

  try {
    return configSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Configuration validation failed:");
      error.errors.forEach((err) => {
        console.error(`  ${err.path.join(".")}: ${err.message}`);
      });
    }
    throw new Error("Invalid configuration");
  }
}

// Global config instance
export const config = loadConfig();