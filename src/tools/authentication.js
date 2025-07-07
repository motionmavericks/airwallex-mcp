import { getClient } from '../client.js';

export const authenticationTools = [
  {
    name: 'airwallex_authenticate',
    description: 'Authenticate with Airwallex API using client credentials',
    inputSchema: {
      type: 'object',
      properties: {
        clientId: {
          type: 'string',
          description: 'Airwallex Client ID (optional, uses env var if not provided)',
        },
        apiKey: {
          type: 'string',
          description: 'Airwallex API Key (optional, uses env var if not provided)',
        },
        environment: {
          type: 'string',
          enum: ['demo', 'production'],
          description: 'API environment (optional, defaults to demo)',
        },
      },
    },
    handler: async (args) => {
      const client = getClient();
      
      // Update client config if provided
      if (args.clientId) client.clientId = args.clientId;
      if (args.apiKey) client.apiKey = args.apiKey;
      if (args.environment) client.environment = args.environment;
      
      const result = await client.authenticate();
      return `Authentication successful! Token expires at ${result.expiresAt}`;
    },
  },
  {
    name: 'airwallex_get_auth_status',
    description: 'Check current authentication status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    handler: async () => {
      const client = getClient();
      const status = client.getAuthStatus();
      
      if (!status.authenticated) {
        return 'Not authenticated. Please run airwallex_authenticate first.';
      }
      
      return `Authenticated: Yes\nEnvironment: ${status.environment}\nToken expires at: ${status.expiresAt}`;
    },
  },
];
