# PatrickCarmo MCP Server

A simple and friendly Model Context Protocol (MCP) server that provides warm greetings with dynamic data and fetches the latest articles from Tabnews.

## Features

- 🌟 **Friendly Greetings**: Generate warm, personalized greetings in English (US)
- 📅 **Dynamic Date/Time**: Shows current date and time in a human-readable format
- ✨ **Fun Facts**: Includes random interesting facts to brighten your day
- 👋 **Personalization**: Optional name parameter for customized greetings
- 📰 **Tabnews Integration**: Fetch latest articles from Tabnews with titles, URLs, and metadata
- 🚀 **Easy to Use**: Simple multi-tool MCP server

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Test the server**:
   ```bash
   npm test
   ```

## Usage

### Running the Server Manually

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

#### `get_tabnews_articles`

Fetches the latest articles from Tabnews with titles, URLs, authors, and metadata.

**Parameters:**
- `limit` (optional, number): Maximum number of articles to fetch (default: 10, max: 30)

**Example Usage:**

```json
{
  "method": "tools/call",
  "params": {
    "name": "get_tabnews_articles",
    "arguments": {
      "limit": 5
    }
  }
}
```

**Sample Output:**
```
📰 Latest 3 articles from Tabnews:

1. **How my team made 100 deployments to production on a Friday**
   📍 URL: https://www.tabnews.com.br/ChristoPy/how-my-team-made-100-deployments-to-production-on-friday
   👤 Author: ChristoPy
   📅 Published: Jul 8, 2025
   💰 Tabcoins: 17
   💬 Comments: 9
   🔗 Source: https://x.com/ChristoPy_/status/1941223288459624534

2. **🚀 After 10 years I (almost) became a dev and launched my MVP: Group Finder**
   📍 URL: https://www.tabnews.com.br/LeonardoSartor/after-10-years-almost-became-dev-and-launched-my-mvp-group-finder
   👤 Author: LeonardoSartor
   📅 Published: Jul 7, 2025
   💰 Tabcoins: 6
   💬 Comments: 0

---
Fetched from Tabnews API at 7/9/2025, 11:53:08 AM
```

**Sample Output (Friendly Greeting):**
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

## Troubleshooting

### Common Issues

#### 1. Timeout Errors
If you see timeout errors in the Claude logs:
- Ensure you're using Node.js >= 18.0.0
- Check that the path in your configuration is correct
- Test the server locally with `npm test`

#### 2. Node.js Version Problems
If Claude is using an older Node.js version:
- Specify the full path to Node.js in your configuration
- Example: `"/Users/yourname/.nvm/versions/node/v18.20.4/bin/node"`

#### 3. Server Not Found
If Claude can't find the server:
- Verify the project path is correct in your configuration
- Make sure the `index.js` file exists and is executable
- Check that dependencies are installed with `npm install`

#### 4. Connection Issues
If the server disconnects frequently:
- Restart Claude Desktop completely
- Check the logs at `~/Library/Logs/Claude/mcp-server-patrickcarmo-mcp-server.log`
- Ensure no other process is using the same server name

### Logs Location

Server logs can be found at:
- **macOS**: `~/Library/Logs/Claude/mcp-server-patrickcarmo-mcp-server.log`
- **Windows**: `%APPDATA%\Claude\Logs\mcp-server-patrickcarmo-mcp-server.log`
- **Linux**: `~/.config/Claude/logs/mcp-server-patrickcarmo-mcp-server.log`

## Error Handling

The server includes comprehensive error handling:
- Graceful shutdown on SIGINT/SIGTERM
- Error responses for invalid tool calls
- Detailed error messages for debugging
- Timeout protection for initialization

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