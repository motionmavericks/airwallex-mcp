import { getClient } from '../client.js';

export const fxTools = [
  {
    name: 'airwallex_get_fx_rates',
    description: 'Get foreign exchange rates',
    inputSchema: {
      type: 'object',
      properties: {
        base: {
          type: 'string',
          description: 'Base currency code',
        },
        target: {
          type: 'string',
          description: 'Target currency code',
        },
        date: {
          type: 'string',
          description: 'Date for historical rates (YYYY-MM-DD)',
        },
      },
      required: ['base', 'target'],
    },
    handler: async (args) => {
      const client = getClient();
      const params = {
        base: args.base,
        target: args.target,
      };
      
      if (args.date) params.date = args.date;
      
      const rates = await client.get('/fx/rates', params);
      return rates;
    },
  },
  {
    name: 'airwallex_create_fx_quote',
    description: 'Create a foreign exchange quote',
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
        valid_until: {
          type: 'string',
          description: 'Quote validity time (ISO 8601)',
        },
      },
      required: ['sell_currency', 'buy_currency'],
    },
    handler: async (args) => {
      const client = getClient();
      
      if (!args.sell_amount && !args.buy_amount) {
        throw new Error('Either sell_amount or buy_amount must be specified');
      }
      
      const quote = await client.post('/fx/quotes', args);
      return quote;
    },
  },
  {
    name: 'airwallex_confirm_fx_quote',
    description: 'Confirm a foreign exchange quote',
    inputSchema: {
      type: 'object',
      properties: {
        quote_id: {
          type: 'string',
          description: 'FX quote ID to confirm',
        },
      },
      required: ['quote_id'],
    },
    handler: async (args) => {
      const client = getClient();
      const result = await client.post(`/fx/quotes/${args.quote_id}/confirm`);
      return result;
    },
  },
  {
    name: 'airwallex_get_fx_deal',
    description: 'Get foreign exchange deal details',
    inputSchema: {
      type: 'object',
      properties: {
        deal_id: {
          type: 'string',
          description: 'FX deal ID',
        },
      },
      required: ['deal_id'],
    },
    handler: async (args) => {
      const client = getClient();
      const deal = await client.get(`/fx/deals/${args.deal_id}`);
      return deal;
    },
  },
];
