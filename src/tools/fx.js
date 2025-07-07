export const fxTools = [
  {
    name: 'airwallex_get_fx_rates',
    description: 'Get foreign exchange rates for currency pairs',
    inputSchema: {
      type: 'object',
      properties: {
        source_currency: {
          type: 'string',
          description: 'Source currency code (e.g., USD)',
        },
        target_currency: {
          type: 'string',
          description: 'Target currency code (e.g., EUR)',
        },
        date: {
          type: 'string',
          description: 'Date for historical rates (ISO 8601 format)',
        },
      },
      required: ['source_currency', 'target_currency'],
    },
    handler: async (client, args) => {
      const params = {
        source_currency: args.source_currency,
        target_currency: args.target_currency,
      };
      
      if (args.date) params.date = args.date;
      
      const response = await client.get('/fx/rates', params);
      return response;
    },
  },
  {
    name: 'airwallex_create_fx_quote',
    description: 'Create a quote for currency conversion',
    inputSchema: {
      type: 'object',
      properties: {
        sell_currency: {
          type: 'string',
          description: 'Currency to sell',
        },
        buy_currency: {
          type: 'string',
          description: 'Currency to buy',
        },
        sell_amount: {
          type: 'number',
          description: 'Amount to sell (specify either sell_amount or buy_amount)',
        },
        buy_amount: {
          type: 'number',
          description: 'Amount to buy (specify either sell_amount or buy_amount)',
        },
        request_id: {
          type: 'string',
          description: 'Unique request ID for idempotency',
        },
      },
      required: ['sell_currency', 'buy_currency'],
    },
    handler: async (client, args) => {
      const data = {
        sell_currency: args.sell_currency,
        buy_currency: args.buy_currency,
      };
      
      if (args.sell_amount) {
        data.sell_amount = args.sell_amount;
        data.quote_type = 'sell';
      } else if (args.buy_amount) {
        data.buy_amount = args.buy_amount;
        data.quote_type = 'buy';
      } else {
        throw new Error('Either sell_amount or buy_amount must be provided');
      }
      
      if (args.request_id) data.request_id = args.request_id;
      
      const response = await client.post('/fx/quotes/create', data);
      return response;
    },
  },
  {
    name: 'airwallex_create_fx_conversion',
    description: 'Execute a currency conversion using a quote',
    inputSchema: {
      type: 'object',
      properties: {
        quote_id: {
          type: 'string',
          description: 'ID of the FX quote to execute',
        },
        request_id: {
          type: 'string',
          description: 'Unique request ID for idempotency',
        },
        reason: {
          type: 'string',
          description: 'Reason for the conversion',
        },
      },
      required: ['quote_id'],
    },
    handler: async (client, args) => {
      const data = {
        quote_id: args.quote_id,
      };
      
      if (args.request_id) data.request_id = args.request_id;
      if (args.reason) data.reason = args.reason;
      
      const response = await client.post('/fx/conversions/create', data);
      return response;
    },
  },
  {
    name: 'airwallex_get_fx_conversion',
    description: 'Get details of a currency conversion',
    inputSchema: {
      type: 'object',
      properties: {
        conversion_id: {
          type: 'string',
          description: 'ID of the conversion',
        },
      },
      required: ['conversion_id'],
    },
    handler: async (client, args) => {
      const response = await client.get(`/fx/conversions/${args.conversion_id}`);
      return response;
    },
  },
  {
    name: 'airwallex_list_fx_conversions',
    description: 'List currency conversions with optional filters',
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
          description: 'Filter by conversion status',
        },
        from_created_at: {
          type: 'string',
          description: 'Filter conversions created after this date',
        },
        to_created_at: {
          type: 'string',
          description: 'Filter conversions created before this date',
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
      
      const response = await client.get('/fx/conversions', params);
      return response;
    },
  },
];