![Conductor Banner](./docs/logo_narrow.webp)

# 🎼 Conductor – n8n MCP Server

**Conductor** is a developer-friendly Model Context Protocol (MCP) server that gives AI agents secure, real-time access to your [n8n](https://n8n.io) workflows. Whether you want to list, run, build, or manage automations—Conductor bridges the gap between natural language and operational workflows.

> Expose your n8n instance as a toolset to agents like Claude, GPT, LangChain, and more.

---

## ✨ Features

- 🔧 **Workflow Control** – List, create, activate, update, delete workflows
- 🎛 **Execution Access** – Query, inspect, or delete execution history
- 🌐 **Webhook Triggering** – Fire workflows remotely via webhook endpoints
- 🧠 **MCP-Native** – Exposes n8n as MCP tools (JSON-RPC 2.0 with streaming)
- 🛡️ **Secure by Default** – N8N API key authentication and optional request auth
- 🧰 **Type-Safe Toolkit** – Written in full TypeScript with robust validation

---

## 📦 Prerequisites

- Node.js **18+**
- Access to a local or remote **n8n instance**
- Your **n8n API key** with appropriate access

---

## 🚀 Quick Start

### 🧪 Install & Configure

```bash
git clone https://github.com/ddnetters/conductor.git
cd conductor
npm install
cp .env.example .env
```

Update `.env` with your n8n credentials:

```env
N8N_API_URL=http://localhost:5678
N8N_API_KEY=your_api_key_here
```

---

### 🟢 Start the Server

```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

---

### 🔌 Use with Your MCP Agent

Example agent config (Claude, OpenAI, LangChain, etc.):

```json
{
  "mcpServers": {
    "conductor": {
      "command": "npx",
      "args": ["conductor"],
      "env": {
        "N8N_API_URL": "http://localhost:5678",
        "N8N_API_KEY": "your_api_key"
      }
    }
  }
}
```

---

## 🧠 Available Tools

### 🔄 Workflow Tools

| Tool               | Description                         |
|--------------------|-------------------------------------|
| `list_workflows`   | List all workflows                  |
| `get_workflow`     | Get a workflow by ID                |
| `create_workflow`  | Create a new workflow               |
| `update_workflow`  | Update an existing workflow         |
| `delete_workflow`  | Remove a workflow                   |
| `activate_workflow`| Enable a workflow                   |
| `deactivate_workflow`| Disable a workflow               |

### 📊 Execution Tools

| Tool               | Description                         |
|--------------------|-------------------------------------|
| `list_executions`  | View recent executions              |
| `get_execution`    | Get execution details               |
| `delete_execution` | Remove execution logs               |

### 🎯 Webhook Tools

| Tool               | Description                         |
|--------------------|-------------------------------------|
| `run_webhook`      | Trigger a workflow by webhook       |

---

## 🧰 Project Structure

```
src/
├── index.ts           # MCP server entry point
├── types.ts           # n8n type definitions
├── config.ts          # Env + config loader
├── handlers/          # Tool-specific logic
│   ├── workflows.ts
│   ├── executions.ts
│   └── webhooks.ts
├── client/
│   └── n8n.ts         # n8n API client wrapper
└── utils/
    ├── logger.ts
    └── validation.ts
```

---

## 🛠 Dev Scripts

```bash
npm run dev         # Run with hot reload
npm run build       # Compile for production
npm run start       # Run built server
npm test            # Run unit tests
npm run lint        # Lint source files
npm run type-check  # TypeScript type safety
```

---

## 🤝 Contributing

Want to improve Conductor? Awesome:

1. Fork this repo
2. Create a new branch: `git checkout -b feat/amazing-feature`
3. Commit your changes: `git commit -m "feat: add amazing feature"`
4. Push to GitHub: `git push origin feat/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT — see the [LICENSE](LICENSE) for full details.

---

## 💬 Support & Links

- 📂 [GitHub Issues](https://github.com/ddnetters/conductor/issues)
- 📚 [n8n API Docs](https://docs.n8n.io/api/)
- 🔗 [Model Context Protocol](https://modelcontextprotocol.io/)
