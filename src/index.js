#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError
} from '@modelcontextprotocol/sdk/types.js';
import dotenv from 'dotenv';
import { AirwallexClient } from './client.js';
import { authenticationTools } from './tools/authentication.js';
import { accountTools } from './tools/accounts.js';
import { balanceTools } from './tools/balances.js';
import { paymentTools } from './tools/payments.js';
import { fxTools } from './tools/fx.js';
import { transferTools } from './tools/transfers.js';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['AIRWALLEX_CLIENT_ID', 'AIRWALLEX_API_KEY'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Error: ${envVar} is required in environment variables`);
    process.exit(1);
  }
}

// Initialize Airwallex client
const airwallexClient = new AirwallexClient({
  clientId: process.env.AIRWALLEX_CLIENT_ID,
  apiKey: process.env.AIRWALLEX_API_KEY,
  environment: process.env.AIRWALLEX_ENVIRONMENT || 'demo',
  baseUrl: process.env.AIRWALLEX_BASE_URL
});

// Create MCP server
const server = new Server(
  {
    name: 'airwallex-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Combine all tools
const allTools = [
  ...authenticationTools,
  ...accountTools,
  ...balanceTools,
  ...paymentTools,
  ...fxTools,
  ...transferTools
];

// Handle list tools request
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: allTools.map(tool => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema,
    })),
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  const tool = allTools.find(t => t.name === name);
  if (!tool) {
    throw new McpError(
      ErrorCode.MethodNotFound,
      `Tool ${name} not found`
    );
  }
  
  try {
    // Ensure client is authenticated before making API calls
    if (name !== 'airwallex_authenticate' && !airwallexClient.isAuthenticated()) {
      await airwallexClient.authenticate();
    }
    
    const result = await tool.handler(airwallexClient, args);
    
    return {
      content: [
        {
          type: 'text',
          text: typeof result === 'string' ? result : JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    console.error(`Error executing tool ${name}:`, error);
    
    if (error.response?.data) {
      throw new McpError(
        ErrorCode.InternalError,
        `Airwallex API error: ${JSON.stringify(error.response.data)}`
      );
    }
    
    throw new McpError(
      ErrorCode.InternalError,
      `Error executing tool: ${error.message}`
    );
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Airwallex MCP server started');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});