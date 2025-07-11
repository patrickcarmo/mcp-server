#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  isInitializeRequest,
} from "@modelcontextprotocol/sdk/types.js";
import https from "https";
import express from "express";
import { randomUUID } from "node:crypto";

/**
 * Create a friendly greeting with dynamic data
 * @param {string} [name] - Optional name to personalize the greeting
 * @returns {string} A friendly greeting with current date, time, and fun fact
 */
function createFriendlyGreeting(name = "Friend") {
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
 * Fetch articles from Tabnews API using Node.js https module
 * @param {number} [limit] - Maximum number of articles to fetch (default: 10)
 * @returns {Promise<string>} Formatted list of articles with titles and URLs
 */
async function fetchTabnewsArticles(limit = 10) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'www.tabnews.com.br',
      port: 443,
      path: '/api/v1/contents',
      method: 'GET',
      headers: {
        'User-Agent': 'PatrickCarmo MCP Server/1.0.0',
        'Accept': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          if (res.statusCode !== 200) {
            resolve(`Error fetching articles from Tabnews: HTTP ${res.statusCode}`);
            return;
          }

          const articles = JSON.parse(data);
          
          if (!Array.isArray(articles)) {
            resolve('Error fetching articles from Tabnews: Invalid response format');
            return;
          }
          
          // Filter only published articles and limit results
          const publishedArticles = articles
            .filter(article => article.status === 'published' && article.type === 'content')
            .slice(0, limit);
          
          if (publishedArticles.length === 0) {
            resolve('No published articles found on Tabnews.');
            return;
          }
          
          // Format articles list
          let result = `📰 Latest ${publishedArticles.length} articles from Tabnews:\n\n`;
          
          publishedArticles.forEach((article, index) => {
            const articleUrl = `https://www.tabnews.com.br/${article.owner_username}/${article.slug}`;
            const publishedDate = new Date(article.published_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });
            
            result += `${index + 1}. **${article.title}**\n`;
            result += `   📍 URL: ${articleUrl}\n`;
            result += `   👤 Author: ${article.owner_username}\n`;
            result += `   📅 Published: ${publishedDate}\n`;
            result += `   💰 Tabcoins: ${article.tabcoins}\n`;
            result += `   💬 Comments: ${article.children_deep_count}\n`;
            
            if (article.source_url) {
              result += `   🔗 Source: ${article.source_url}\n`;
            }
            
            result += '\n';
          });
          
          result += `---\nFetched from Tabnews API at ${new Date().toLocaleString('en-US')}`;
          
          resolve(result);
          
        } catch (error) {
          resolve(`Error parsing Tabnews response: ${error.message}`);
        }
      });
    });

    req.on('error', (error) => {
      resolve(`Error fetching articles from Tabnews: ${error.message}`);
    });

    req.end();
  });
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
        {
          name: "get_tabnews_articles",
          description: "Fetch the latest articles from Tabnews with titles, URLs, authors, and metadata. Returns a formatted list of published articles.",
          inputSchema: {
            type: "object",
            properties: {
              limit: {
                type: "number",
                description: "Maximum number of articles to fetch (default: 10, max: 30)",
                minimum: 1,
                maximum: 30,
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
    } else if (name === "get_tabnews_articles") {
      try {
        const limit = args?.limit || 10;
        // Ensure limit is within bounds
        const validatedLimit = Math.min(Math.max(limit, 1), 30);
        
        const articles = await fetchTabnewsArticles(validatedLimit);
        
        return {
          content: [
            {
              type: "text",
              text: articles,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching Tabnews articles: ${error.message}`,
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
 * Start STDIO server (current mode)
 */
async function startStdioServer() {
  try {
    const server = await createServer();
    const transport = new StdioServerTransport();
    
    // Add error handling for transport
    transport.onError = (error) => {
      console.error("Transport error:", error);
    };
    
    await server.connect(transport);
    
    // Log to stderr so it doesn't interfere with the MCP protocol
    console.error("🚀 PatrickCarmo MCP Server (STDIO) is running!");
    console.error("📋 Available tools:");
    console.error("  - friendly_greeting: Generate a warm greeting with current date/time");
    console.error("  - get_tabnews_articles: Fetch latest articles from Tabnews with titles and URLs");
    console.error("💡 Usage: Call tools with optional parameters for customization");
    
    // Keep the process alive
    process.on('disconnect', () => {
      console.error('Parent process disconnected, shutting down...');
      process.exit(0);
    });
    
  } catch (error) {
    console.error("❌ Failed to start STDIO server:", error);
    process.exit(1);
  }
}

/**
 * Start HTTP server (new mode)
 */
async function startHTTPServer(port = 3000) {
  const app = express();
  app.use(express.json());

  // Enable CORS for browser-based clients
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, mcp-session-id');
    res.header('Access-Control-Expose-Headers', 'mcp-session-id');
    
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }
    next();
  });

  // Map to store transports by session ID
  const transports = {};

  // Handle POST requests for client-to-server communication
  app.post('/mcp', async (req, res) => {
    const sessionId = req.headers['mcp-session-id'];
    let transport;

    if (sessionId && transports[sessionId]) {
      // Reuse existing transport
      transport = transports[sessionId];
    } else if (!sessionId && isInitializeRequest(req.body)) {
      // New initialization request
      const newSessionId = randomUUID();
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => newSessionId,
        onsessioninitialized: (sessionId) => {
          transports[sessionId] = transport;
        },
      });

      // Clean up transport when closed
      transport.onclose = () => {
        if (transport.sessionId) {
          delete transports[transport.sessionId];
        }
      };

      const server = await createServer();
      await server.connect(transport);
      
      // Ensure session ID is set in response headers
      res.setHeader('mcp-session-id', newSessionId);
    } else {
      res.status(400).json({
        jsonrpc: '2.0',
        error: {
          code: -32000,
          message: 'Bad Request: No valid session ID provided',
        },
        id: null,
      });
      return;
    }

    await transport.handleRequest(req, res, req.body);
  });

  // Handle GET requests for server-to-client notifications via SSE
  app.get('/mcp', async (req, res) => {
    const sessionId = req.headers['mcp-session-id'];
    if (!sessionId || !transports[sessionId]) {
      res.status(400).send('Invalid or missing session ID');
      return;
    }
    
    const transport = transports[sessionId];
    await transport.handleRequest(req, res);
  });

  // Handle DELETE requests for session termination
  app.delete('/mcp', async (req, res) => {
    const sessionId = req.headers['mcp-session-id'];
    if (!sessionId || !transports[sessionId]) {
      res.status(400).send('Invalid or missing session ID');
      return;
    }
    
    const transport = transports[sessionId];
    await transport.handleRequest(req, res);
  });

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'OK',
      service: 'PatrickCarmo MCP Server',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      available_tools: ['friendly_greeting', 'get_tabnews_articles']
    });
  });

  app.listen(port, () => {
    console.log(`🌐 PatrickCarmo MCP Server (HTTP) running on port ${port}`);
    console.log(`📡 MCP Endpoint: http://localhost:${port}/mcp`);
    console.log(`🔍 Health Check: http://localhost:${port}/health`);
    console.log("📋 Available tools:");
    console.log("  - friendly_greeting: Generate a warm greeting with current date/time");
    console.log("  - get_tabnews_articles: Fetch latest articles from Tabnews with titles and URLs");
    console.log("💡 Usage: Connect MCP clients to the /mcp endpoint");
  });
}

/**
 * Main function - decide which transport to use
 */
async function main() {
  const args = process.argv.slice(2);
  const mode = args.find(arg => arg.startsWith('--mode='))?.split('=')[1] || 'stdio';
  const port = parseInt(args.find(arg => arg.startsWith('--port='))?.split('=')[1] || '3000');

  if (mode === 'http') {
    await startHTTPServer(port);
  } else {
    await startStdioServer();
  }
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

// Start the server with timeout
const startServer = async () => {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('Server initialization timed out after 30 seconds'));
    }, 30000);
  });

  try {
    await Promise.race([main(), timeoutPromise]);
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();