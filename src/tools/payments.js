export const paymentTools = [
  {
    name: 'airwallex_create_payment_intent',
    description: 'Create a payment intent to accept payments',
    inputSchema: {
      type: 'object',
      properties: {
        amount: {
          type: 'number',
          description: 'Payment amount',
        },
        currency: {
          type: 'string',
          description: 'Three-letter ISO currency code (e.g., USD, EUR)',
        },
        merchant_order_id: {
          type: 'string',
          description: 'Your unique order identifier',
        },
        request_id: {
          type: 'string',
          description: 'Unique request ID for idempotency',
        },
        customer_id: {
          type: 'string',
          description: 'ID of an existing customer',
        },
        descriptor: {
          type: 'string',
          description: 'Statement descriptor',
        },
        metadata: {
          type: 'object',
          description: 'Additional metadata as key-value pairs',
        },
      },
      required: ['amount', 'currency'],
    },
    handler: async (client, args) => {
      const data = {
        amount: args.amount,
        currency: args.currency,
        merchant_order_id: args.merchant_order_id,
      };
      
      if (args.request_id) data.request_id = args.request_id;
      if (args.customer_id) data.customer_id = args.customer_id;
      if (args.descriptor) data.descriptor = args.descriptor;
      if (args.metadata) data.metadata = args.metadata;
      
      const response = await client.post('/pa/payment_intents/create', data);
      return response;
    },
  },
  {
    name: 'airwallex_get_payment_intent',
    description: 'Retrieve details of a payment intent',
    inputSchema: {
      type: 'object',
      properties: {
        payment_intent_id: {
          type: 'string',
          description: 'The ID of the payment intent',
        },
      },
      required: ['payment_intent_id'],
    },
    handler: async (client, args) => {
      const response = await client.get(`/pa/payment_intents/${args.payment_intent_id}`);
      return response;
    },
  },
  {
    name: 'airwallex_confirm_payment_intent',
    description: 'Confirm a payment intent',
    inputSchema: {
      type: 'object',
      properties: {
        payment_intent_id: {
          type: 'string',
          description: 'The ID of the payment intent to confirm',
        },
        request_id: {
          type: 'string',
          description: 'Unique request ID for idempotency',
        },
        payment_method_id: {
          type: 'string',
          description: 'ID of the payment method to use',
        },
        payment_method_options: {
          type: 'object',
          description: 'Payment method specific options',
        },
      },
      required: ['payment_intent_id'],
    },
    handler: async (client, args) => {
      const data = {};
      
      if (args.request_id) data.request_id = args.request_id;
      if (args.payment_method_id) data.payment_method_id = args.payment_method_id;
      if (args.payment_method_options) data.payment_method_options = args.payment_method_options;
      
      const response = await client.post(`/pa/payment_intents/${args.payment_intent_id}/confirm`, data);
      return response;
    },
  },
  {
    name: 'airwallex_list_payments',
    description: 'List all payments with optional filters',
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
          description: 'Filter by payment status',
        },
        from_created_at: {
          type: 'string',
          description: 'Filter payments created after this date (ISO 8601)',
        },
        to_created_at: {
          type: 'string',
          description: 'Filter payments created before this date (ISO 8601)',
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
      
      const response = await client.get('/pa/payments', params);
      return response;
    },
  },
  {
    name: 'airwallex_refund_payment',
    description: 'Create a refund for a payment',
    inputSchema: {
      type: 'object',
      properties: {
        payment_intent_id: {
          type: 'string',
          description: 'The ID of the payment intent to refund',
        },
        amount: {
          type: 'number',
          description: 'Amount to refund (optional, defaults to full amount)',
        },
        reason: {
          type: 'string',
          description: 'Reason for the refund',
        },
        request_id: {
          type: 'string',
          description: 'Unique request ID for idempotency',
        },
        metadata: {
          type: 'object',
          description: 'Additional metadata',
        },
      },
      required: ['payment_intent_id'],
    },
    handler: async (client, args) => {
      const data = {};
      
      if (args.amount) data.amount = args.amount;
      if (args.reason) data.reason = args.reason;
      if (args.request_id) data.request_id = args.request_id;
      if (args.metadata) data.metadata = args.metadata;
      
      const response = await client.post(`/pa/refunds/create`, {
        payment_intent_id: args.payment_intent_id,
        ...data,
      });
      return response;
    },
  },
];