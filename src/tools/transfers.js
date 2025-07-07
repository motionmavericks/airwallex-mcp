export const transferTools = [
  {
    name: 'airwallex_create_beneficiary',
    description: 'Create a beneficiary (recipient) for transfers',
    inputSchema: {
      type: 'object',
      properties: {
        beneficiary_type: {
          type: 'string',
          description: 'Type of beneficiary (personal or business)',
          enum: ['personal', 'business'],
        },
        first_name: {
          type: 'string',
          description: 'First name (for personal beneficiaries)',
        },
        last_name: {
          type: 'string',
          description: 'Last name (for personal beneficiaries)',
        },
        company_name: {
          type: 'string',
          description: 'Company name (for business beneficiaries)',
        },
        nickname: {
          type: 'string',
          description: 'Nickname for the beneficiary',
        },
        bank_details: {
          type: 'object',
          description: 'Bank account details',
          properties: {
            account_currency: {
              type: 'string',
              description: 'Currency of the bank account',
            },
            account_number: {
              type: 'string',
              description: 'Bank account number',
            },
            account_routing_type1: {
              type: 'string',
              description: 'Routing type (e.g., aba, swift_code)',
            },
            account_routing_value1: {
              type: 'string',
              description: 'Routing value',
            },
            bank_country_code: {
              type: 'string',
              description: 'Two-letter country code',
            },
          },
          required: ['account_currency', 'bank_country_code'],
        },
      },
      required: ['beneficiary_type', 'bank_details'],
    },
    handler: async (client, args) => {
      const data = {
        beneficiary_type: args.beneficiary_type,
        bank_details: args.bank_details,
      };
      
      if (args.beneficiary_type === 'personal') {
        if (!args.first_name || !args.last_name) {
          throw new Error('first_name and last_name are required for personal beneficiaries');
        }
        data.first_name = args.first_name;
        data.last_name = args.last_name;
      } else {
        if (!args.company_name) {
          throw new Error('company_name is required for business beneficiaries');
        }
        data.company_name = args.company_name;
      }
      
      if (args.nickname) data.nickname = args.nickname;
      
      const response = await client.post('/beneficiaries/create', data);
      return response;
    },
  },
  {
    name: 'airwallex_list_beneficiaries',
    description: 'List all beneficiaries',
    inputSchema: {
      type: 'object',
      properties: {
        page_num: {
          type: 'integer',
          description: 'Page number (starts from 0)',
          default: 0,
        },
        page_size: {
          type: 'integer',
          description: 'Number of results per page',
          default: 20,
        },
        bank_country_code: {
          type: 'string',
          description: 'Filter by bank country code',
        },
      },
    },
    handler: async (client, args) => {
      const params = {
        page_num: args.page_num || 0,
        page_size: args.page_size || 20,
      };
      
      if (args.bank_country_code) params.bank_country_code = args.bank_country_code;
      
      const response = await client.get('/beneficiaries', params);
      return response;
    },
  },
  {
    name: 'airwallex_create_transfer',
    description: 'Create a transfer to a beneficiary',
    inputSchema: {
      type: 'object',
      properties: {
        beneficiary_id: {
          type: 'string',
          description: 'ID of the beneficiary',
        },
        source_currency: {
          type: 'string',
          description: 'Currency to send from',
        },
        transfer_amount: {
          type: 'number',
          description: 'Amount to transfer',
        },
        transfer_currency: {
          type: 'string',
          description: 'Currency to transfer',
        },
        reference: {
          type: 'string',
          description: 'Transfer reference',
        },
        reason: {
          type: 'string',
          description: 'Reason for transfer',
        },
        request_id: {
          type: 'string',
          description: 'Unique request ID for idempotency',
        },
        quote_id: {
          type: 'string',
          description: 'FX quote ID if currency conversion is needed',
        },
      },
      required: ['beneficiary_id', 'source_currency', 'transfer_amount', 'transfer_currency'],
    },
    handler: async (client, args) => {
      const data = {
        beneficiary_id: args.beneficiary_id,
        source_currency: args.source_currency,
        transfer_amount: args.transfer_amount,
        transfer_currency: args.transfer_currency,
      };
      
      if (args.reference) data.reference = args.reference;
      if (args.reason) data.reason = args.reason;
      if (args.request_id) data.request_id = args.request_id;
      if (args.quote_id) data.quote_id = args.quote_id;
      
      const response = await client.post('/transfers/create', data);
      return response;
    },
  },
  {
    name: 'airwallex_get_transfer',
    description: 'Get details of a transfer',
    inputSchema: {
      type: 'object',
      properties: {
        transfer_id: {
          type: 'string',
          description: 'ID of the transfer',
        },
      },
      required: ['transfer_id'],
    },
    handler: async (client, args) => {
      const response = await client.get(`/transfers/${args.transfer_id}`);
      return response;
    },
  },
  {
    name: 'airwallex_list_transfers',
    description: 'List transfers with optional filters',
    inputSchema: {
      type: 'object',
      properties: {
        page_num: {
          type: 'integer',
          description: 'Page number (starts from 0)',
          default: 0,
        },
        page_size: {
          type: 'integer',
          description: 'Number of results per page',
          default: 20,
        },
        status: {
          type: 'string',
          description: 'Filter by transfer status',
        },
        from_created_at: {
          type: 'string',
          description: 'Filter transfers created after this date',
        },
        to_created_at: {
          type: 'string',
          description: 'Filter transfers created before this date',
        },
      },
    },
    handler: async (client, args) => {
      const params = {
        page_num: args.page_num || 0,
        page_size: args.page_size || 20,
      };
      
      if (args.status) params.status = args.status;
      if (args.from_created_at) params.from_created_at = args.from_created_at;
      if (args.to_created_at) params.to_created_at = args.to_created_at;
      
      const response = await client.get('/transfers', params);
      return response;
    },
  },
  {
    name: 'airwallex_cancel_transfer',
    description: 'Cancel a pending transfer',
    inputSchema: {
      type: 'object',
      properties: {
        transfer_id: {
          type: 'string',
          description: 'ID of the transfer to cancel',
        },
        reason: {
          type: 'string',
          description: 'Reason for cancellation',
        },
      },
      required: ['transfer_id'],
    },
    handler: async (client, args) => {
      const data = {};
      if (args.reason) data.reason = args.reason;
      
      const response = await client.post(`/transfers/${args.transfer_id}/cancel`, data);
      return response;
    },
  },
];