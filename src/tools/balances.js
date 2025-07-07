export const balanceTools = [
  {
    name: 'airwallex_get_current_balances',
    description: 'Get current balances for all currencies in the account',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    handler: async (client) => {
      const balances = await client.get('/balances/current');
      return balances;
    },
  },
  {
    name: 'airwallex_get_balance_history',
    description: 'Get balance history for the account with optional date range (max 7 days)',
    inputSchema: {
      type: 'object',
      properties: {
        currency: {
          type: 'string',
          description: 'Filter by specific currency (e.g., USD, EUR, AUD)',
        },
        from_created_at: {
          type: 'string',
          description: 'Start date in ISO 8601 format (e.g., 2024-01-01T00:00:00Z)',
        },
        to_created_at: {
          type: 'string',
          description: 'End date in ISO 8601 format (e.g., 2024-01-07T23:59:59Z)',
        },
        page_num: {
          type: 'integer',
          description: 'Page number for pagination (starts from 0)',
          default: 0,
        },
        page_size: {
          type: 'integer',
          description: 'Number of results per page',
          default: 20,
        },
      },
    },
    handler: async (client, args) => {
      const params = {
        page_num: args.page_num || 0,
        page_size: args.page_size || 20,
      };
      
      if (args.currency) params.currency = args.currency;
      if (args.from_created_at) params.from_created_at = args.from_created_at;
      if (args.to_created_at) params.to_created_at = args.to_created_at;
      
      const response = await client.get('/balances/history', params);
      return response;
    },
  },
  {
    name: 'airwallex_get_transactions',
    description: 'Get transaction history for the account',
    inputSchema: {
      type: 'object',
      properties: {
        currency: {
          type: 'string',
          description: 'Filter by specific currency',
        },
        transaction_type: {
          type: 'string',
          description: 'Filter by transaction type (e.g., payment, transfer, conversion)',
        },
        from_created_at: {
          type: 'string',
          description: 'Start date in ISO 8601 format',
        },
        to_created_at: {
          type: 'string',
          description: 'End date in ISO 8601 format',
        },
        page_num: {
          type: 'integer',
          description: 'Page number for pagination (starts from 0)',
          default: 0,
        },
        page_size: {
          type: 'integer',
          description: 'Number of results per page',
          default: 20,
        },
      },
    },
    handler: async (client, args) => {
      const params = {
        page_num: args.page_num || 0,
        page_size: args.page_size || 20,
      };
      
      if (args.currency) params.currency = args.currency;
      if (args.transaction_type) params.transaction_type = args.transaction_type;
      if (args.from_created_at) params.from_created_at = args.from_created_at;
      if (args.to_created_at) params.to_created_at = args.to_created_at;
      
      const response = await client.get('/financial_transactions', params);
      return response;
    },
  },
];