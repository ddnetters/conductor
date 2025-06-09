# 🤖 n8n MCP Server

A Model Context Protocol (MCP) server that provides AI assistants with the ability to interact with n8n automation platform APIs. This enables AI models to create, manage, and execute n8n workflows programmatically.

## ✨ Features

- **🔄 Workflow Management**: Create, read, update, delete, and manage n8n workflows
- **📊 Execution Monitoring**: Monitor and manage workflow executions
- **🎣 Webhook Integration**: Trigger workflows via webhooks
- **🛡️ Type Safety**: Full TypeScript support with robust type definitions
- **⚠️ Error Handling**: Comprehensive error handling and validation
- **🔐 Authentication**: Secure API key authentication with n8n

## 📋 Prerequisites

- Node.js 18+ and npm
- Access to n8n instance (local or cloud)
- n8n API key

## 🚀 Quick Start

### 📦 Installation

```bash
# Clone the repository
git clone https://github.com/ddnetters/n8n-mcp-server.git
cd n8n-mcp-server

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Configure your n8n connection in .env
```

### ⚙️ Configuration

Create a `.env` file with your n8n configuration:

```env
N8N_API_URL=http://localhost:5678
N8N_API_KEY=your_api_key_here
```

### 🎯 Usage

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

### 🔌 MCP Client Integration

Add to your MCP client configuration:

```json
{
  "mcpServers": {
    "n8n": {
      "command": "npx",
      "args": ["n8n-mcp-server"],
      "env": {
        "N8N_API_URL": "http://localhost:5678",
        "N8N_API_KEY": "your_api_key"
      }
    }
  }
}
```

## 🛠️ Available MCP Tools

### 🔄 Workflow Operations
- `list_workflows` - Get all workflows
- `get_workflow` - Get workflow details by ID
- `create_workflow` - Create new workflow
- `update_workflow` - Update existing workflow
- `delete_workflow` - Delete workflow
- `activate_workflow` - Activate workflow
- `deactivate_workflow` - Deactivate workflow

### 📊 Execution Operations
- `list_executions` - Get workflow executions
- `get_execution` - Get execution details
- `delete_execution` - Delete execution

### 🎣 Webhook Operations
- `run_webhook` - Execute workflow via webhook

## 💻 Development

### 📜 Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build production bundle
npm run start        # Start production server
npm test             # Run tests
npm run lint         # Check code style
npm run type-check   # TypeScript validation
```

### 📁 Project Structure

```
src/
├── index.ts           # Main MCP server entry point
├── types.ts           # n8n API types and interfaces
├── config.ts          # Configuration management
├── handlers/          # MCP tool handlers
│   ├── workflows.ts   # Workflow operations
│   ├── executions.ts  # Execution operations
│   └── webhooks.ts    # Webhook operations
├── client/
│   └── n8n.ts         # n8n API client
└── utils/
    ├── logger.ts      # Logging utilities
    └── validation.ts  # Input validation helpers
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💬 Support

- **🐛 Issues**: [GitHub Issues](https://github.com/ddnetters/n8n-mcp-server/issues)
- **📚 n8n Documentation**: [n8n API Docs](https://docs.n8n.io/api/)
- **🔗 MCP Documentation**: [Model Context Protocol](https://modelcontextprotocol.io/)