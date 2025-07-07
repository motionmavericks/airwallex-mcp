import { getClient } from '../client.js';

export const accountTools = [
  {
    name: 'airwallex_get_account',
    description: 'Get current account details',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    handler: async () => {
      const client = getClient();
      const account = await client.get('/account');
      return account;
    },
  },
  {
    name: 'airwallex_get_account_status',
    description: 'Get account verification status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    handler: async () => {
      const client = getClient();
      const status = await client.get('/account/status');
      return status;
    },
  },
  {
    name: 'airwallex_list_linked_accounts',
    description: 'List all linked accounts',
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
          default: 20,
        },
      },
    },
    handler: async (args) => {
      const client = getClient();
      const accounts = await client.get('/linked_accounts', {
        page_num: args.page_num || 0,
        page_size: args.page_size || 20,
      });
      return accounts;
    },
  },
  {
    name: 'airwallex_get_linked_account',
    description: 'Get details of a specific linked account',
    inputSchema: {
      type: 'object',
      properties: {
        account_id: {
          type: 'string',
          description: 'The linked account ID',
        },
      },
      required: ['account_id'],
    },
    handler: async (args) => {
      const client = getClient();
      const account = await client.get(`/linked_accounts/${args.account_id}`);
      return account;
    },
  },
];
