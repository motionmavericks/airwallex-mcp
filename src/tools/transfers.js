import { getClient } from '../client.js';

export const transferTools = [
  {
    name: 'airwallex_create_transfer',
    description: 'Create a new transfer between accounts',
    inputSchema: {
      type: 'object',
      properties: {
        amount: {
          type: 'number',
          description: 'Transfer amount',
        },
        currency: {
          type: 'string',
          description: 'Currency code',
        },
        source_account_id: {
          type: 'string',
          description: 'Source account ID',
        },
        destination_account_id: {
          type: 'string',
          description: 'Destination account ID',
        },
        reference: {
          type: 'string',
          description: 'Transfer reference',
        },
        reason: {
          type: 'string',
          description: 'Reason for transfer',
        },
      },
      required: ['amount', 'currency', 'source_account_id', 'destination_account_id'],
    },
    handler: async (args) => {
      const client = getClient();
      const transfer = await client.post('/transfers', args);
      return transfer;
    },
  },
  {
    name: 'airwallex_get_transfer',
    description: 'Get transfer details by ID',
    inputSchema: {
      type: 'object',
      properties: {
        transfer_id: {
          type: 'string',
          description: 'Transfer ID',
        },
      },
      required: ['transfer_id'],
    },
    handler: async (args) => {
      const client = getClient();
      const transfer = await client.get(`/transfers/${args.transfer_id}`);
      return transfer;
    },
  },
  {
    name: 'airwallex_list_transfers',
    description: 'List transfers with optional filters',
    inputSchema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          description: 'Transfer status filter',
          enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED'],
        },
        from_created_at: {
          type: 'string',
          description: 'Start date filter (ISO 8601)',
        },
        to_created_at: {
          type: 'string',
          description: 'End date filter (ISO 8601)',
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
    },
    handler: async (args) => {
      const client = getClient();
      const params = {
        page_num: args.page_num || 0,
        page_size: args.page_size || 50,
      };
      
      if (args.status) params.status = args.status;
      if (args.from_created_at) params.from_created_at = args.from_created_at;
      if (args.to_created_at) params.to_created_at = args.to_created_at;
      
      const transfers = await client.get('/transfers', params);
      return transfers;
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
          description: 'Transfer ID to cancel',
        },
        reason: {
          type: 'string',
          description: 'Cancellation reason',
        },
      },
      required: ['transfer_id'],
    },
    handler: async (args) => {
      const client = getClient();
      const data = {};
      if (args.reason) data.reason = args.reason;
      
      const result = await client.post(`/transfers/${args.transfer_id}/cancel`, data);
      return result;
    },
  },
];
