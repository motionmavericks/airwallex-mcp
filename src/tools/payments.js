import { getClient } from '../client.js';

export const paymentTools = [
  {
    name: 'airwallex_create_payment',
    description: 'Create a new payment',
    inputSchema: {
      type: 'object',
      properties: {
        amount: {
          type: 'number',
          description: 'Payment amount',
        },
        currency: {
          type: 'string',
          description: 'Currency code (e.g., USD, EUR)',
        },
        beneficiary_id: {
          type: 'string',
          description: 'ID of the beneficiary',
        },
        reference: {
          type: 'string',
          description: 'Payment reference',
        },
        reason: {
          type: 'string',
          description: 'Reason for payment',
        },
        source_account_id: {
          type: 'string',
          description: 'Source account ID (optional)',
        },
      },
      required: ['amount', 'currency', 'beneficiary_id'],
    },
    handler: async (args) => {
      const client = getClient();
      const payment = await client.post('/payments', {
        payment_method: 'LOCAL',
        ...args,
      });
      return payment;
    },
  },
  {
    name: 'airwallex_get_payment',
    description: 'Get payment details by ID',
    inputSchema: {
      type: 'object',
      properties: {
        payment_id: {
          type: 'string',
          description: 'Payment ID',
        },
      },
      required: ['payment_id'],
    },
    handler: async (args) => {
      const client = getClient();
      const payment = await client.get(`/payments/${args.payment_id}`);
      return payment;
    },
  },
  {
    name: 'airwallex_list_payments',
    description: 'List payments with optional filters',
    inputSchema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          description: 'Payment status filter',
          enum: ['PENDING', 'CONFIRMED', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED'],
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
      
      const payments = await client.get('/payments', params);
      return payments;
    },
  },
  {
    name: 'airwallex_confirm_payment',
    description: 'Confirm a pending payment',
    inputSchema: {
      type: 'object',
      properties: {
        payment_id: {
          type: 'string',
          description: 'Payment ID to confirm',
        },
      },
      required: ['payment_id'],
    },
    handler: async (args) => {
      const client = getClient();
      const result = await client.post(`/payments/${args.payment_id}/confirm`);
      return result;
    },
  },
  {
    name: 'airwallex_cancel_payment',
    description: 'Cancel a payment',
    inputSchema: {
      type: 'object',
      properties: {
        payment_id: {
          type: 'string',
          description: 'Payment ID to cancel',
        },
        reason: {
          type: 'string',
          description: 'Cancellation reason',
        },
      },
      required: ['payment_id'],
    },
    handler: async (args) => {
      const client = getClient();
      const data = {};
      if (args.reason) data.reason = args.reason;
      
      const result = await client.post(`/payments/${args.payment_id}/cancel`, data);
      return result;
    },
  },
];
