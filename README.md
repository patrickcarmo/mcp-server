# PatrickCarmo MCP Server 🚀

A MCP (Model Context Protocol) server that provides friendly greetings and fetches Tabnews articles, with support for **STDIO** and **HTTP** transport.

## 🌟 Features

- **Dual Transport**: Supports STDIO and HTTP
- **Friendly Greeting**: Generates personalized greetings with date, time and fun facts
- **Tabnews Integration**: Fetches latest articles from Tabnews
- **Session Management**: Session management for HTTP
- **CORS Support**: Ready for web clients
- **Health Check**: Health check endpoint

## 📋 Available Tools

### 1. `friendly_greeting`
- **Description**: Generate a warm greeting with current date, time and a fun fact
- **Parameters**: 
  - `name` (optional): Name to personalize the greeting
- **Example**: `{ "name": "Patrick" }`

### 2. `get_tabnews_articles`
- **Description**: Fetch latest articles from Tabnews with titles, URLs and metadata
- **Parameters**:
  - `limit` (optional): Maximum number of articles to fetch (default: 10, max: 30)
- **Example**: `{ "limit": 5 }`

## 🚀 Installation

```bash
npm install
```

## 🔧 Usage

### STDIO Mode (for Claude Desktop and other MCP clients)
```bash
npm run start:stdio
# or
npm run start
```

### HTTP Mode (for web clients and REST APIs)
```bash
npm run start:http
# or
npm run start:http:dev  # runs on port 8080
```

## 🌐 HTTP Endpoints

When running in HTTP mode:

- **MCP Endpoint**: `http://localhost:3000/mcp`
- **Health Check**: `http://localhost:3000/health`

## 📝 HTTP Testing

Use the provided `mcp-server.http` file with the VS Code REST Client extension:

1. Install the **REST Client** extension in VS Code
2. Open `mcp-server.http`
3. Start the server: `npm run start:http`
4. Click **"Send Request"** on any request in the file

### Example Requests:

```http
# Initialize session
POST http://localhost:3000/mcp
Content-Type: application/json

{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2024-11-05",
    "capabilities": { "tools": {} },
    "clientInfo": { "name": "rest-client", "version": "1.0.0" }
  }
}

# Call friendly greeting
POST http://localhost:3000/mcp
Content-Type: application/json
mcp-session-id: YOUR_SESSION_ID

{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "friendly_greeting",
    "arguments": { "name": "Patrick" }
  }
}
```

## 🔄 How Both Transports Work

Your **services/tools remain exactly the same** regardless of transport:

- **STDIO**: Uses standard input/output for communication
- **HTTP**: Uses HTTP requests with session management

The transport layer is **completely separate** from your tool logic, so:
- ✅ Your `friendly_greeting` tool works in both modes
- ✅ Your `get_tabnews_articles` tool works in both modes
- ✅ Claude Desktop can still connect via STDIO
- ✅ Web clients can connect via HTTP

## 🤖 Using with Claude Desktop

Add to your Claude Desktop MCP configuration:

```json
{
  "mcpServers": {
    "patrickcarmo-mcp-server": {
      "command": "node",
      "args": ["/path/to/your/mcp-server/index.js"],
      "env": {}
    }
  }
}
```

## 🌟 Example Usage

### STDIO Mode
```bash
npm run start:stdio
# Server starts and waits for MCP protocol messages
```

### HTTP Mode
```bash
npm run start:http
# Server starts on http://localhost:3000
```

## 📚 MCP Protocol Support

- **Version**: 2024-11-05
- **Capabilities**: Tools
- **Transport**: STDIO and HTTP
- **Session Management**: Supported in HTTP mode

## 🛠️ Development

```bash
# Run in STDIO mode
npm run start:stdio

# Run in HTTP mode
npm run start:http

# Run HTTP on custom port
node index.js --mode=http --port=8080

# Test STDIO client
npm test
```

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   MCP Client    │    │   MCP Client    │    │   Web Client    │
│  (Claude, etc)  │    │  (STDIO/CLI)    │    │  (Browser/API)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │ STDIO                 │ STDIO                 │ HTTP
         │                       │                       │
         └─────────────────────────┴───────────────────────┘
                                 │
                    ┌─────────────────────────┐
                    │   PatrickCarmo MCP      │
                    │       Server            │
                    │                         │
                    │  ┌─────────────────┐    │
                    │  │ friendly_greeting│    │
                    │  └─────────────────┘    │
                    │                         │
                    │  ┌─────────────────┐    │
                    │  │get_tabnews_articles│  │
                    │  └─────────────────┘    │
                    └─────────────────────────┘
```

## 🔧 Configuration

### Environment Variables
- `NODE_ENV`: Set to `production` for production mode
- `PORT`: HTTP port (default: 3000)
- `MCP_MODE`: Transport mode (`stdio` or `http`)

### Command Line Arguments
- `--mode=stdio|http`: Set transport mode
- `--port=3000`: Set HTTP port

## 📖 API Reference

### Health Check
```http
GET /health
```

### MCP Endpoint
```http
POST /mcp
GET /mcp     # For SSE in HTTP mode
DELETE /mcp  # For session cleanup
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

ISC License - see LICENSE file for details

---

**Ready to use with both Claude Desktop (STDIO) and web clients (HTTP)!** 🎉 