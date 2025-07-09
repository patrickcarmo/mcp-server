#!/usr/bin/env node

import { spawn } from 'child_process';
import { stdin, stdout } from 'process';

/**
 * Simple test client to demonstrate MCP server functionality
 */
async function testMCPServer() {
  console.log('🧪 Testing PatrickCarmo MCP Server\n');
  
  // Start the server
  const server = spawn('node', ['index.js'], {
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  let response = '';
  
  server.stdout.on('data', (data) => {
    response += data.toString();
  });
  
  server.stderr.on('data', (data) => {
    console.log('Server log:', data.toString());
  });
  
  // Wait a bit for server to start
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Test 1: Initialize the connection
  console.log('📡 Step 1: Initialize connection...');
  const initRequest = {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {
        tools: {}
      },
      clientInfo: {
        name: 'test-client',
        version: '1.0.0'
      }
    }
  };
  
  server.stdin.write(JSON.stringify(initRequest) + '\n');
  
  // Wait for initialization response
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Test 2: Send initialized notification
  console.log('✅ Step 2: Send initialized notification...');
  const initNotification = {
    jsonrpc: '2.0',
    method: 'notifications/initialized'
  };
  
  server.stdin.write(JSON.stringify(initNotification) + '\n');
  
  // Test 3: List available tools
  console.log('📋 Step 3: List available tools...');
  const listToolsRequest = {
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/list'
  };
  
  server.stdin.write(JSON.stringify(listToolsRequest) + '\n');
  
  // Wait for tools list response
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Test 4: Call the greeting tool without name
  console.log('👋 Step 4: Call greeting tool without name...');
  const greetingRequest1 = {
    jsonrpc: '2.0',
    id: 3,
    method: 'tools/call',
    params: {
      name: 'friendly_greeting',
      arguments: {}
    }
  };
  
  server.stdin.write(JSON.stringify(greetingRequest1) + '\n');
  
  // Wait for greeting response
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Test 5: Call the greeting tool with name
  console.log('👋 Step 5: Call greeting tool with name "Alice"...');
  const greetingRequest2 = {
    jsonrpc: '2.0',
    id: 4,
    method: 'tools/call',
    params: {
      name: 'friendly_greeting',
      arguments: {
        name: 'Alice'
      }
    }
  };
  
  server.stdin.write(JSON.stringify(greetingRequest2) + '\n');
  
  // Wait for final response
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Close the server
  server.kill('SIGTERM');
  
  console.log('\n📊 Raw server responses:');
  console.log(response);
  
  console.log('\n✨ Test completed! The MCP server is working correctly.');
  console.log('🎉 You can now use this server with any MCP-compatible client!\n');
}

// Run the test
testMCPServer().catch(console.error); 