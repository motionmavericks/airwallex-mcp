# Airwallex MCP Server

A Model Context Protocol (MCP) server for interacting with the Airwallex API. This server provides tools for managing payments, accounts, foreign exchange, and transfers through Claude Code.

## Features

- 🔐 **Authentication**: Secure API authentication with automatic token management
- 💰 **Account Management**: View account details, linked accounts, and payment methods
- 📊 **Balance Operations**: Check current balances and transaction history
- 💳 **Payment Processing**: Create and manage payment intents, process refunds
- 💱 **Foreign Exchange**: Get FX rates, create quotes, and execute conversions
- 💸 **Transfers**: Create beneficiaries and send international transfers

## Prerequisites

- Node.js 18.0.0 or higher
- Airwallex account with API credentials
- Claude Code installed

## Installation

### Quick Install (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/motionmavericks/airwallex-mcp.git
cd airwallex-mcp
```

2. Install dependencies:
```bash
npm install
```

3. Configure your credentials:
```bash
cp .env.example .env
# Edit .env with your Airwallex credentials
```

4. Add to Claude Code:
```bash
# Using the provided installation script
./install-claude.sh

# Or manually add to Claude Code
claude mcp add /path/to/airwallex-mcp
```

## Configuration

Create a `.env` file with your Airwallex credentials:

```env
# Required
AIRWALLEX_CLIENT_ID=your_client_id_here
AIRWALLEX_API_KEY=your_api_key_here

# Optional (defaults to demo)
AIRWALLEX_ENVIRONMENT=demo  # or production

# Optional: Override base URL
# AIRWALLEX_BASE_URL=https://api-demo.airwallex.com/api/v1
```

### Getting Airwallex Credentials

1. Log in to your [Airwallex account](https://www.airwallex.com)
2. Navigate to Settings → API Keys
3. Create a new API key or use an existing one
4. Copy the Client ID and API Key

## Available Tools

### Authentication
- `airwallex_authenticate` - Authenticate with the Airwallex API
- `airwallex_check_auth_status` - Check current authentication status

### Account Management
- `airwallex_get_account_details` - Get your account information
- `airwallex_list_linked_accounts` - List all linked accounts
- `airwallex_get_linked_account` - Get specific linked account details
- `airwallex_list_payment_methods` - List available payment methods

### Balance Operations
- `airwallex_get_current_balances` - Get current balances for all currencies
- `airwallex_get_balance_history` - Get balance history (max 7 days)
- `airwallex_get_transactions` - Get transaction history

### Payment Processing
- `airwallex_create_payment_intent` - Create a payment intent
- `airwallex_get_payment_intent` - Get payment intent details
- `airwallex_confirm_payment_intent` - Confirm a payment intent
- `airwallex_list_payments` - List all payments
- `airwallex_refund_payment` - Create a refund

### Foreign Exchange
- `airwallex_get_fx_rates` - Get exchange rates
- `airwallex_create_fx_quote` - Create an FX quote
- `airwallex_create_fx_conversion` - Execute currency conversion
- `airwallex_get_fx_conversion` - Get conversion details
- `airwallex_list_fx_conversions` - List all conversions

### Transfers
- `airwallex_create_beneficiary` - Create a transfer recipient
- `airwallex_list_beneficiaries` - List all beneficiaries
- `airwallex_create_transfer` - Create a transfer
- `airwallex_get_transfer` - Get transfer details
- `airwallex_list_transfers` - List all transfers
- `airwallex_cancel_transfer` - Cancel a pending transfer

## Usage Examples

### Authentication
```
Use airwallex_authenticate to start a session
```

### Check Balance
```
Use airwallex_get_current_balances to see all currency balances
```

### Create a Payment
```
Use airwallex_create_payment_intent with:
- amount: 100.00
- currency: "USD"
- merchant_order_id: "ORDER-123"
```

### Get FX Rate
```
Use airwallex_get_fx_rates with:
- source_currency: "USD"
- target_currency: "EUR"
```

### Create a Transfer
```
First create a beneficiary with airwallex_create_beneficiary
Then use airwallex_create_transfer with the beneficiary_id
```

## Development

### Running in Development Mode
```bash
npm run dev
```

### Project Structure
```
airwallex-mcp/
├── src/
│   ├── index.js          # Main server entry point
│   ├── client.js         # Airwallex API client
│   └── tools/            # Tool implementations
│       ├── authentication.js
│       ├── accounts.js
│       ├── balances.js
│       ├── payments.js
│       ├── fx.js
│       └── transfers.js
├── .env.example          # Environment variable template
├── package.json          # Project dependencies
└── README.md            # This file
```

## Troubleshooting

### Authentication Errors
- Ensure your CLIENT_ID and API_KEY are correct
- Check if you're using the right environment (demo vs production)
- Verify your API key has the necessary permissions

### Rate Limiting
Airwallex has rate limits on their API. If you encounter rate limit errors:
- Reduce the frequency of requests
- Implement exponential backoff for retries
- Contact Airwallex support for higher limits

### Network Issues
- Check your internet connection
- Verify the base URL is correct for your region
- Ensure no firewall is blocking the requests

## Security

- Never commit your `.env` file or expose your API credentials
- Use environment-specific credentials (demo for testing, production for live)
- Regularly rotate your API keys
- Monitor your API usage for any unusual activity

## Support

- [Airwallex API Documentation](https://www.airwallex.com/docs/api)
- [Airwallex Support](https://help.airwallex.com)
- For MCP server issues, check the logs in Claude Code

## License

MIT License - see LICENSE file for details