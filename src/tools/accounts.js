export const accountTools = [
  {
    name: 'airwallex_get_account_details',
    description: 'Get details of the authenticated Airwallex account',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    handler: async (client) => {
      const account = await client.get('/account');
      return account;
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
      
      const response = await client.get('/linked_accounts', params);
      return response;
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
          description: 'The ID of the linked account',
        },
      },
      required: ['account_id'],
    },
    handler: async (client, args) => {
      const account = await client.get(`/linked_accounts/${args.account_id}`);
      return account;
    },
  },
  {
    name: 'airwallex_list_payment_methods',
    description: 'List available payment methods for the account',
    inputSchema: {
      type: 'object',
      properties: {
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
      
      const response = await client.get('/payment_methods', params);
      return response;
    },
  },
];