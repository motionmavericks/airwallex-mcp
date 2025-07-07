import { getClient } from '../client.js';

export const balanceTools = [
  {
    name: 'airwallex_get_balances',
    description: 'Get all currency balances for the account',
    inputSchema: {
      type: 'object',
      properties: {
        page_num: {
          type: 'integer',
          description: 'Page number (0-based)',
          default: 0,
        },
        page_size: {
          type: 'integer',
          description: 'Number of results per page',
          default: 50,
        },
      },
    },
    handler: async (args) => {
      const client = getClient();
      const balances = await client.get('/balances', {
        page_num: args.page_num || 0,
        page_size: args.page_size || 50,
      });
      return balances;
    },
  },
  {
    name: 'airwallex_get_balance',
    description: 'Get balance for a specific currency',
    inputSchema: {
      type: 'object',
      properties: {
        currency: {
          type: 'string',
          description: 'Currency code (e.g., USD, EUR, GBP)',
        },
      },
      required: ['currency'],
    },
    handler: async (args) => {
      const client = getClient();
      const balance = await client.get(`/balances/${args.currency}`);
      return balance;
    },
  },
  {
    name: 'airwallex_get_balance_history',
    description: 'Get balance history for a specific currency',
    inputSchema: {
      type: 'object',
      properties: {
        currency: {
          type: 'string',
          description: 'Currency code',
        },
        from_created_at: {
          type: 'string',
          description: 'Start date (ISO 8601 format)',
        },
        to_created_at: {
          type: 'string',
          description: 'End date (ISO 8601 format)',
        },
        page_num: {
          type: 'integer',
          default: 0,
        },
        page_size: {
          type: 'integer',
          default: 50,
        },
      },
      required: ['currency'],
    },
    handler: async (args) => {
      const client = getClient();
      const params = {
        page_num: args.page_num || 0,
        page_size: args.page_size || 50,
      };
      
      if (args.from_created_at) params.from_created_at = args.from_created_at;
      if (args.to_created_at) params.to_created_at = args.to_created_at;
      
      const history = await client.get(`/balances/${args.currency}/history`, params);
      return history;
    },
  },
];
