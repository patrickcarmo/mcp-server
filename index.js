#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

/**
 * Create a friendly greeting with dynamic data
 * @param {string} [name] - Optional name to personalize the greeting
 * @returns {string} A friendly greeting with current date, time, and fun fact
 */
function createFriendlyGreeting(name) {
  const now = new Date();
  
  // Format date and time in English (US)
  const dateOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  const timeOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  };
  
  const formattedDate = now.toLocaleDateString('en-US', dateOptions);
  const formattedTime = now.toLocaleTimeString('en-US', timeOptions);
  
  // Get time-based greeting
  const hour = now.getHours();
  let timeGreeting;
  
  if (hour >= 5 && hour < 12) {
    timeGreeting = "Good morning";
  } else if (hour >= 12 && hour < 17) {
    timeGreeting = "Good afternoon";
  } else if (hour >= 17 && hour < 21) {
    timeGreeting = "Good evening";
  } else {
    timeGreeting = "Good night";
  }
  
  // Create personalized greeting
  const personalGreeting = name ? `${timeGreeting}, ${name}! 👋` : `${timeGreeting}! 👋`;
  
  // Fun facts array
  const funFacts = [
    "Did you know that octopuses have three hearts? 🐙",
    "Honey never spoils - archaeologists have found edible honey in ancient Egyptian tombs! 🍯",
    "A group of flamingos is called a 'flamboyance' - how fabulous! 🦩",
    "Bananas are berries, but strawberries aren't! 🍌",
    "The shortest war in history lasted only 38-45 minutes! ⚔️",
    "A shrimp's heart is in its head! 🦐",
    "Butterflies taste with their feet! 🦋",
    "An octopus has blue blood! 💙",
    "Wombat droppings are cube-shaped! 🟦",
    "A sneeze travels at about 100 mph! 🤧"
  ];
  
  const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];
  
  return `${personalGreeting}

🌟 Welcome to our friendly MCP server! 🌟

📅 Today is: ${formattedDate}
⏰ Current time: ${formattedTime}

✨ Here's a fun fact to brighten your day:
${randomFact}

Hope you're having a wonderful time! Feel free to ask if you need anything else! 😊

---
Generated with ❤️ by PatrickCarmo MCP Server`;
}

/**
 * Create and configure the MCP server
 */
async function createServer() {
  const server = new Server(
    {
      name: "patrickcarmo-mcp-server",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Handle tool listing
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: "friendly_greeting",
          description: "Generate a warm, friendly greeting with current date, time, and a fun fact. Optionally accepts a name for personalization.",
          inputSchema: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description: "Optional name to personalize the greeting",
              },
            },
            additionalProperties: false,
          },
        },
      ],
    };
  });

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    if (name === "friendly_greeting") {
      try {
        const userName = args?.name;
        const greeting = createFriendlyGreeting(userName);
        
        return {
          content: [
            {
              type: "text",
              text: greeting,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error generating greeting: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    } else {
      throw new Error(`Unknown tool: ${name}`);
    }
  });

  return server;
}

/**
 * Main function to start the server
 */
async function main() {
  const server = await createServer();
  const transport = new StdioServerTransport();
  
  await server.connect(transport);
  
  // Log to stderr so it doesn't interfere with the MCP protocol
  console.error("🚀 PatrickCarmo MCP Server is running!");
  console.error("📋 Available tools:");
  console.error("  - friendly_greeting: Generate a warm greeting with current date/time");
  console.error("💡 Usage: Call the tool with optional 'name' parameter for personalization");
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.error('Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.error('Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

// Start the server
main().catch((error) => {
  console.error("❌ Failed to start server:", error);
  process.exit(1);
});