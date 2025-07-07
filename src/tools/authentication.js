export const authenticationTools = [
  {
    name: 'airwallex_authenticate',
    description: 'Authenticate with Airwallex API using client credentials',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    handler: async (client) => {
      const result = await client.authenticate();
      return `Successfully authenticated with Airwallex. Token expires at: ${result.expiresAt}`;
    },
  },
  {
    name: 'airwallex_check_auth_status',
    description: 'Check current authentication status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    handler: async (client) => {
      const isAuthenticated = client.isAuthenticated();
      
      if (isAuthenticated) {
        return {
          authenticated: true,
          tokenExpiry: client.tokenExpiry,
          environment: client.environment,
          baseUrl: client.baseUrl,
        };
      } else {
        return {
          authenticated: false,
          message: 'Not authenticated. Please run airwallex_authenticate first.',
        };
      }
    },
  },
];