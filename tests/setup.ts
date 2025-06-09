// Jest setup file for global test configuration

// Mock environment variables for testing
process.env.N8N_API_URL = "http://localhost:5678";
process.env.N8N_API_KEY = "test-api-key";
process.env.LOG_LEVEL = "error"; // Reduce noise in tests
process.env.NODE_ENV = "test";

// Global test timeout
jest.setTimeout(10000);