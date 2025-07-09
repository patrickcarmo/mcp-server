# PatrickCarmo MCP Server

A simple and friendly Model Context Protocol (MCP) server that provides warm greetings with dynamic data including current date, time, and fun facts.

## Features

- 🌟 **Friendly Greetings**: Generate warm, personalized greetings in English (US)
- 📅 **Dynamic Date/Time**: Shows current date and time in a human-readable format
- ✨ **Fun Facts**: Includes random interesting facts to brighten your day
- 👋 **Personalization**: Optional name parameter for customized greetings
- 🚀 **Easy to Use**: Simple single-tool MCP server

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Make the server executable** (optional):
   ```bash
   chmod +x index.js
   ```

## Usage

### Running the Server

```bash
node index.js
```

The server will start and listen for MCP protocol messages via stdio.

### Available Tools

#### `friendly_greeting`

Generates a warm, friendly greeting with current date, time, and a fun fact.

**Parameters:**
- `name` (optional, string): Name to personalize the greeting

**Example Usage:**

```json
{
  "method": "tools/call",
  "params": {
    "name": "friendly_greeting",
    "arguments": {
      "name": "Alice"
    }
  }
}
```

**Sample Output:**
```
Good morning, Alice! 👋

🌟 Welcome to our friendly MCP server! 🌟

📅 Today is: Monday, January 15, 2024
⏰ Current time: 10:30:45 AM EST

✨ Here's a fun fact to brighten your day:
Did you know that octopuses have three hearts? 🐙

Hope you're having a wonderful time! Feel free to ask if you need anything else! 😊

---
Generated with ❤️ by PatrickCarmo MCP Server
```

## Server Configuration

### Server Info
- **Name**: `patrickcarmo-mcp-server`
- **Version**: `1.0.0`
- **Capabilities**: Tools support

### Tool Schema
```json
{
  "name": "friendly_greeting",
  "description": "Generate a warm, friendly greeting with current date, time, and a fun fact. Optionally accepts a name for personalization.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "name": {
        "type": "string",
        "description": "Optional name to personalize the greeting"
      }
    },
    "additionalProperties": false
  }
}
```

## Integration with MCP Clients

### Claude Desktop

To use this server with Claude Desktop, add the following to your MCP configuration:

```json
{
  "mcpServers": {
    "patrickcarmo-mcp-server": {
      "command": "node",
      "args": ["/path/to/your/mcp-server/index.js"]
    }
  }
}
```

### Other MCP Clients

This server follows the standard MCP protocol and can be integrated with any MCP-compatible client using stdio transport.

## Development

### Project Structure
```
mcp-server/
├── .gitignore        # Git ignore file
├── index.js          # Main server file
├── package.json      # Dependencies and scripts
├── test-client.js    # Test client for verification
└── README.md         # This file
```

### Dependencies
- `@modelcontextprotocol/sdk`: Official MCP SDK for JavaScript

### Fun Facts Database

The server includes a curated collection of interesting fun facts:
- Animal facts 🐙🦩🦐🦋
- Historical facts ⚔️
- Nature facts 🍯🍌
- Science facts 🤧

## Error Handling

The server includes comprehensive error handling:
- Graceful shutdown on SIGINT/SIGTERM
- Error responses for invalid tool calls
- Detailed error messages for debugging

## Contributing

Feel free to contribute by:
1. Adding more fun facts
2. Improving the greeting messages
3. Adding new features
4. Enhancing error handling

## License

ISC License

## Author

Patrick Carmo

---

Built with ❤️ using the Model Context Protocol 