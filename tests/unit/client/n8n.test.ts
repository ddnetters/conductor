import axios from 'axios';
import { N8nClient } from '../../../src/client/n8n';
import { config } from '../../../src/config';
import type { 
  N8nWorkflow, 
  CreateWorkflowRequest, 
  UpdateWorkflowRequest,
  N8nExecution,
  ListWorkflowsQuery,
  ListExecutionsQuery,
  WebhookExecutionRequest,
  N8nError
} from '../../../src/types';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock config
jest.mock('../../../src/config', () => ({
  config: {
    n8n: {
      apiUrl: 'http://localhost:5678',
      apiKey: 'test-api-key'
    }
  }
}));

describe('N8nClient', () => {
  let client: N8nClient;
  let mockAxiosInstance: any;
  let mockRequestInterceptor: jest.Mock;
  let mockResponseInterceptor: jest.Mock;
  let mockRequestErrorHandler: jest.Mock;
  let mockResponseErrorHandler: jest.Mock;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Create mock functions for interceptors
    mockRequestInterceptor = jest.fn();
    mockResponseInterceptor = jest.fn();
    mockRequestErrorHandler = jest.fn();
    mockResponseErrorHandler = jest.fn();
    
    // Mock axios.create to return a mocked axios instance
    mockAxiosInstance = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
      interceptors: {
        request: {
          use: jest.fn().mockImplementation((onFulfilled, onRejected) => {
            mockRequestInterceptor.mockImplementation(onFulfilled);
            mockRequestErrorHandler.mockImplementation(onRejected);
          })
        },
        response: {
          use: jest.fn().mockImplementation((onFulfilled, onRejected) => {
            mockResponseInterceptor.mockImplementation(onFulfilled);
            mockResponseErrorHandler.mockImplementation(onRejected);
          })
        }
      }
    };
    
    mockedAxios.create.mockReturnValue(mockAxiosInstance);
    
    client = new N8nClient();
  });

  describe('Constructor', () => {
    it('should create axios instance with correct config', () => {
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: config.n8n.apiUrl,
        headers: {
          'X-N8N-API-KEY': config.n8n.apiKey,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });
    });

    it('should set default options when none provided', () => {
      const testClient = new N8nClient();
      expect(testClient).toBeDefined();
    });

    it('should set custom options when provided', () => {
      const options = {
        maxRetries: 5,
        retryDelay: 2000,
        enableLogging: false
      };
      const testClient = new N8nClient(options);
      expect(testClient).toBeDefined();
    });

    it('should setup request and response interceptors', () => {
      expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
      expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled();
    });
  });

  describe('Workflow Operations', () => {
    const mockWorkflow: N8nWorkflow = {
      id: '1',
      name: 'Test Workflow',
      active: true,
      nodes: [],
      connections: {},
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z'
    };

    describe('listWorkflows', () => {
      it('should list workflows without query parameters', async () => {
        const mockResponse = { data: { data: [mockWorkflow] } };
        mockAxiosInstance.get.mockResolvedValue(mockResponse);

        const result = await client.listWorkflows();

        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/workflows?');
        expect(result).toEqual([mockWorkflow]);
      });

      it('should list workflows with query parameters', async () => {
        const mockResponse = { data: { data: [mockWorkflow] } };
        mockAxiosInstance.get.mockResolvedValue(mockResponse);

        const query: ListWorkflowsQuery = {
          active: true,
          tags: ['test', 'automation'],
          limit: 10,
          offset: 5
        };

        const result = await client.listWorkflows(query);

        expect(mockAxiosInstance.get).toHaveBeenCalledWith(
          '/workflows?active=true&tags=test&tags=automation&limit=10&offset=5'
        );
        expect(result).toEqual([mockWorkflow]);
      });

      it('should handle response data without nested data property', async () => {
        const mockResponse = { data: [mockWorkflow] };
        mockAxiosInstance.get.mockResolvedValue(mockResponse);

        const result = await client.listWorkflows();

        expect(result).toEqual([mockWorkflow]);
      });
    });

    describe('getWorkflow', () => {
      it('should get a workflow by id', async () => {
        const mockResponse = { data: mockWorkflow };
        mockAxiosInstance.get.mockResolvedValue(mockResponse);

        const result = await client.getWorkflow('1');

        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/workflows/1');
        expect(result).toEqual(mockWorkflow);
      });
    });

    describe('createWorkflow', () => {
      it('should create a new workflow', async () => {
        const createRequest: CreateWorkflowRequest = {
          name: 'New Workflow',
          nodes: [],
          connections: {},
          active: false
        };
        const mockResponse = { data: mockWorkflow };
        mockAxiosInstance.post.mockResolvedValue(mockResponse);

        const result = await client.createWorkflow(createRequest);

        expect(mockAxiosInstance.post).toHaveBeenCalledWith('/workflows', createRequest);
        expect(result).toEqual(mockWorkflow);
      });
    });

    describe('updateWorkflow', () => {
      it('should update an existing workflow', async () => {
        const updateRequest: UpdateWorkflowRequest = {
          name: 'Updated Workflow',
          active: true
        };
        const mockResponse = { data: mockWorkflow };
        mockAxiosInstance.put.mockResolvedValue(mockResponse);

        const result = await client.updateWorkflow('1', updateRequest);

        expect(mockAxiosInstance.put).toHaveBeenCalledWith('/workflows/1', updateRequest);
        expect(result).toEqual(mockWorkflow);
      });
    });

    describe('deleteWorkflow', () => {
      it('should delete a workflow', async () => {
        mockAxiosInstance.delete.mockResolvedValue({ data: {} });

        await client.deleteWorkflow('1');

        expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/workflows/1');
      });
    });

    describe('activateWorkflow', () => {
      it('should activate a workflow', async () => {
        const mockResponse = { data: mockWorkflow };
        mockAxiosInstance.post.mockResolvedValue(mockResponse);

        const result = await client.activateWorkflow('1');

        expect(mockAxiosInstance.post).toHaveBeenCalledWith('/workflows/1/activate');
        expect(result).toEqual(mockWorkflow);
      });
    });

    describe('deactivateWorkflow', () => {
      it('should deactivate a workflow', async () => {
        const mockResponse = { data: mockWorkflow };
        mockAxiosInstance.post.mockResolvedValue(mockResponse);

        const result = await client.deactivateWorkflow('1');

        expect(mockAxiosInstance.post).toHaveBeenCalledWith('/workflows/1/deactivate');
        expect(result).toEqual(mockWorkflow);
      });
    });
  });

  describe('Execution Operations', () => {
    const mockExecution: N8nExecution = {
      id: '1',
      workflowId: '1',
      mode: 'manual',
      status: 'success',
      startedAt: '2023-01-01T00:00:00Z',
      finishedAt: '2023-01-01T00:01:00Z'
    };

    describe('listExecutions', () => {
      it('should list executions without query parameters', async () => {
        const mockResponse = { data: { data: [mockExecution] } };
        mockAxiosInstance.get.mockResolvedValue(mockResponse);

        const result = await client.listExecutions();

        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/executions?');
        expect(result).toEqual([mockExecution]);
      });

      it('should list executions with query parameters', async () => {
        const mockResponse = { data: { data: [mockExecution] } };
        mockAxiosInstance.get.mockResolvedValue(mockResponse);

        const query: ListExecutionsQuery = {
          workflowId: '1',
          status: 'success',
          limit: 10,
          offset: 5,
          includeData: true
        };

        const result = await client.listExecutions(query);

        expect(mockAxiosInstance.get).toHaveBeenCalledWith(
          '/executions?workflowId=1&status=success&limit=10&offset=5&includeData=true'
        );
        expect(result).toEqual([mockExecution]);
      });
    });

    describe('getExecution', () => {
      it('should get an execution by id', async () => {
        const mockResponse = { data: mockExecution };
        mockAxiosInstance.get.mockResolvedValue(mockResponse);

        const result = await client.getExecution('1');

        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/executions/1');
        expect(result).toEqual(mockExecution);
      });
    });

    describe('deleteExecution', () => {
      it('should delete an execution', async () => {
        mockAxiosInstance.delete.mockResolvedValue({ data: {} });

        await client.deleteExecution('1');

        expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/executions/1');
      });
    });
  });

  describe('Webhook Operations', () => {
    describe('runWebhook', () => {
      it('should run webhook with POST method (default)', async () => {
        const mockResponse = { data: { success: true } };
        mockAxiosInstance.post.mockResolvedValue(mockResponse);

        const result = await client.runWebhook('test-workflow');

        expect(mockAxiosInstance.post).toHaveBeenCalledWith('/webhook/test-workflow', undefined, { headers: {} });
        expect(result).toEqual({ success: true });
      });

      it('should run webhook with GET method', async () => {
        const mockResponse = { data: { success: true } };
        mockAxiosInstance.get.mockResolvedValue(mockResponse);

        const webhookRequest: WebhookExecutionRequest = {
          method: 'GET',
          headers: { 'Custom-Header': 'value' }
        };

        const result = await client.runWebhook('test-workflow', webhookRequest);

        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/webhook/test-workflow', { 
          headers: { 'Custom-Header': 'value' } 
        });
        expect(result).toEqual({ success: true });
      });

      it('should run webhook with PUT method and data', async () => {
        const mockResponse = { data: { success: true } };
        mockAxiosInstance.put.mockResolvedValue(mockResponse);

        const webhookRequest: WebhookExecutionRequest = {
          method: 'PUT',
          data: { key: 'value' },
          headers: {}
        };

        const result = await client.runWebhook('test-workflow', webhookRequest);

        expect(mockAxiosInstance.put).toHaveBeenCalledWith('/webhook/test-workflow', { key: 'value' }, { headers: {} });
        expect(result).toEqual({ success: true });
      });

      it('should run webhook with PATCH method', async () => {
        const mockResponse = { data: { success: true } };
        mockAxiosInstance.patch.mockResolvedValue(mockResponse);

        const webhookRequest: WebhookExecutionRequest = {
          method: 'PATCH',
          data: { key: 'value' }
        };

        const result = await client.runWebhook('test-workflow', webhookRequest);

        expect(mockAxiosInstance.patch).toHaveBeenCalledWith('/webhook/test-workflow', { key: 'value' }, { headers: {} });
        expect(result).toEqual({ success: true });
      });

      it('should run webhook with DELETE method', async () => {
        const mockResponse = { data: { success: true } };
        mockAxiosInstance.delete.mockResolvedValue(mockResponse);

        const webhookRequest: WebhookExecutionRequest = {
          method: 'DELETE'
        };

        const result = await client.runWebhook('test-workflow', webhookRequest);

        expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/webhook/test-workflow', { headers: {} });
        expect(result).toEqual({ success: true });
      });

      it('should encode workflow name in URL', async () => {
        const mockResponse = { data: { success: true } };
        mockAxiosInstance.post.mockResolvedValue(mockResponse);

        await client.runWebhook('workflow with spaces!@#$%');

        expect(mockAxiosInstance.post).toHaveBeenCalledWith(
          '/webhook/workflow%20with%20spaces!%40%23%24%25', 
          undefined, 
          { headers: {} }
        );
      });

      it('should throw N8nError for unsupported HTTP method', async () => {
        const webhookRequest = {
          method: 'INVALID' as any
        };

        await expect(client.runWebhook('test-workflow', webhookRequest)).rejects.toEqual({
          message: 'Unsupported HTTP method: invalid',
          code: 'INVALID_HTTP_METHOD',
          statusCode: undefined,
          details: { method: 'invalid' }
        });
      });
    });
  });

  describe('Health Check', () => {
    it('should return true when health check succeeds', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: { status: 'ok' } });

      const result = await client.healthCheck();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/health');
      expect(result).toBe(true);
    });

    it('should return false when health check fails', async () => {
      mockAxiosInstance.get.mockRejectedValue(new Error('Network error'));

      const result = await client.healthCheck();

      expect(result).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should handle HTTP error responses', async () => {
      const axiosError = {
        response: {
          status: 404,
          data: {
            message: 'Workflow not found',
            code: 'WORKFLOW_NOT_FOUND'
          }
        },
        message: 'Request failed with status code 404'
      };

      try {
        mockResponseErrorHandler(axiosError);
      } catch (error) {
        const n8nError = error as N8nError;
        expect(n8nError.message).toBe('Workflow not found');
        expect(n8nError.code).toBe('WORKFLOW_NOT_FOUND');
        expect(n8nError.statusCode).toBe(404);
        expect(n8nError.details).toEqual({
          message: 'Workflow not found',
          code: 'WORKFLOW_NOT_FOUND'
        });
      }
    });

    it('should handle network errors', async () => {
      const axiosError = {
        request: {},
        message: 'Network Error'
      };

      try {
        mockResponseErrorHandler(axiosError);
      } catch (error) {
        const n8nError = error as N8nError;
        expect(n8nError.message).toBe('Network error: Unable to connect to n8n');
        expect(n8nError.code).toBe('NETWORK_ERROR');
        expect(n8nError.statusCode).toBeUndefined();
        expect(n8nError.details).toBeUndefined();
      }
    });

    it('should handle unknown errors', async () => {
      const axiosError = {
        message: 'Something went wrong'
      };

      try {
        mockResponseErrorHandler(axiosError);
      } catch (error) {
        const n8nError = error as N8nError;
        expect(n8nError.message).toBe('Something went wrong');
        expect(n8nError.code).toBe('UNKNOWN_ERROR');
        expect(n8nError.statusCode).toBeUndefined();
        expect(n8nError.details).toBeUndefined();
      }
    });
  });

  describe('Retry Logic', () => {
    it('should retry on 5xx errors', async () => {
      const axiosError = {
        response: { status: 500 },
        message: 'Internal Server Error'
      };

      // First call fails, second succeeds
      mockAxiosInstance.get
        .mockRejectedValueOnce(axiosError)
        .mockResolvedValueOnce({ data: { status: 'ok' } });

      const result = await client.healthCheck();

      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(2);
      expect(result).toBe(true);
    });

    it('should retry on 429 (rate limit) errors', async () => {
      const axiosError = {
        response: { status: 429 },
        message: 'Too Many Requests'
      };

      mockAxiosInstance.get
        .mockRejectedValueOnce(axiosError)
        .mockResolvedValueOnce({ data: { status: 'ok' } });

      const result = await client.healthCheck();

      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(2);
      expect(result).toBe(true);
    });

    it('should not retry on 4xx errors (except 429)', async () => {
      const axiosError = {
        response: { status: 404 },
        message: 'Not Found',
        statusCode: 404
      };

      mockAxiosInstance.get.mockRejectedValue(axiosError);

      const result = await client.healthCheck();

      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1);
      expect(result).toBe(false);
    });

    it('should respect maxRetries configuration', async () => {
      jest.clearAllMocks();
      
      // Setup fresh mocks for the custom client
      const customMockAxiosInstance = {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        patch: jest.fn(),
        delete: jest.fn(),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() }
        }
      };
      
      mockedAxios.create.mockReturnValue(customMockAxiosInstance as any);
      
      const customClient = new N8nClient({ maxRetries: 1 });
      
      const axiosError = {
        response: { status: 500 },
        message: 'Internal Server Error',
        statusCode: 500
      };

      customMockAxiosInstance.get.mockRejectedValue(axiosError);

      const result = await customClient.healthCheck();

      // Should try twice (initial + 1 retry)
      expect(customMockAxiosInstance.get).toHaveBeenCalledTimes(2);
      expect(result).toBe(false);
    });
  });

  describe('Logging Configuration', () => {
    it('should not log when logging is disabled', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const clientWithoutLogging = new N8nClient({ enableLogging: false });
      
      // Trigger request interceptor
      mockRequestInterceptor({ method: 'get', url: '/test' });
      
      expect(consoleSpy).not.toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    it('should log when logging is enabled', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const clientWithLogging = new N8nClient({ enableLogging: true });
      
      // Trigger request interceptor
      mockRequestInterceptor({ method: 'get', url: '/test' });
      
      expect(consoleSpy).toHaveBeenCalledWith('[N8N API] GET /test');
      
      consoleSpy.mockRestore();
    });
  });
});