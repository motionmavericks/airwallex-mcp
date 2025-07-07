#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import dotenv from 'dotenv';

// Import all tools
import { authenticationTools } from './tools/authentication.js';
import { accountTools } from './tools/accounts.js';
import { balanceTools } from './tools/balances.js';
import { paymentTools } from './tools/payments.js';
import { fxTools } from './tools/fx.js';
import { transferTools } from './tools/transfers.js';

// Load environment variables
dotenv.config();

// Combine all tools
const allTools = [
  ...authenticationTools,
  ...accountTools,
  ...balanceTools,
  ...paymentTools,
  ...fxTools,
  ...transferTools,
];

// Create server instance
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

// Handle tool listing
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
    throw new Error(`Tool "${name}" not found`);
  }
  
  try {
    const result = await tool.handler(args);
    return {
      content: [
        {
          type: 'text',
          text: typeof result === 'string' ? result : JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Airwallex MCP server running...');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
