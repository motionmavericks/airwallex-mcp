# Airwallex MCP Server

An MCP (Model Context Protocol) server that provides tools for interacting with the Airwallex API. This server enables AI assistants like Claude to manage payments, accounts, foreign exchange, and transfers through Airwallex.

## Features

- **Authentication**: Secure API authentication with automatic token management
- **Account Management**: View account details and settings
- **Balance Operations**: Check balances across multiple currencies
- **Payment Processing**: Create and manage payments
- **Foreign Exchange**: Get rates and create FX conversions
- **Transfers**: Initiate and track money transfers

## Installation

### Quick Install (Recommended)

```bash
# Clone the repository
git clone https://github.com/motionmavericks/airwallex-mcp.git
cd airwallex-mcp

# Run the installer
./install-claude.sh
```

The installer will:
1. Set up your Airwallex API credentials
2. Install dependencies
3. Add the server to Claude Code

### Manual Installation

1. Clone the repository:
```bash
git clone https://github.com/motionmavericks/airwallex-mcp.git
cd airwallex-mcp
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Edit `.env` with your Airwallex credentials:
```env
AIRWALLEX_CLIENT_ID=your_client_id_here
AIRWALLEX_API_KEY=your_api_key_here
AIRWALLEX_ENVIRONMENT=demo  # or 'production'
```

5. Add to Claude Code:
```bash
claude mcp add $(pwd) --name airwallex
```

## Available Tools

### Authentication
- `airwallex_authenticate` - Authenticate with Airwallex API
- `airwallex_get_auth_status` - Check current authentication status

### Accounts
- `airwallex_get_account` - Get account details
- `airwallex_get_account_status` - Get account verification status
- `airwallex_list_linked_accounts` - List linked accounts
- `airwallex_get_linked_account` - Get specific linked account details

### Balances
- `airwallex_get_balances` - Get all currency balances
- `airwallex_get_balance` - Get balance for specific currency
- `airwallex_get_balance_history` - Get balance history

### Payments
- `airwallex_create_payment` - Create a new payment
- `airwallex_get_payment` - Get payment details
- `airwallex_list_payments` - List payments with filters
- `airwallex_confirm_payment` - Confirm a payment
- `airwallex_cancel_payment` - Cancel a payment

### Foreign Exchange
- `airwallex_get_fx_rates` - Get foreign exchange rates
- `airwallex_create_fx_quote` - Create an FX quote
- `airwallex_confirm_fx_quote` - Confirm an FX quote
- `airwallex_get_fx_deal` - Get FX deal details

### Transfers
- `airwallex_create_transfer` - Create a new transfer
- `airwallex_get_transfer` - Get transfer details
- `airwallex_list_transfers` - List transfers
- `airwallex_cancel_transfer` - Cancel a transfer

## Usage Example

In Claude Code, you can use the tools like this:

```
// First authenticate
airwallex_authenticate

// Check your balances
airwallex_get_balances

// Get FX rates
airwallex_get_fx_rates({
  base: "USD",
  target: "EUR"
})

// Create a payment
airwallex_create_payment({
  amount: 1000,
  currency: "USD",
  beneficiary_id: "ben_123456",
  reference: "Invoice #12345"
})
```

## Configuration

The server supports two environments:
- `demo` - Airwallex demo environment for testing
- `production` - Live Airwallex environment

Set the environment in your `.env` file:
```env
AIRWALLEX_ENVIRONMENT=demo
```

## Testing

Test the authentication:
```bash
npm test
```

## Security

- API credentials are stored locally in `.env`
- The server implements automatic token refresh
- All API calls use HTTPS
- Tokens expire after 1 hour and are automatically refreshed

## Development

Run in development mode with auto-reload:
```bash
npm run dev
```

## License

MIT License - see LICENSE file for details

## Support

For issues or questions:
- GitHub Issues: https://github.com/motionmavericks/airwallex-mcp/issues
- Airwallex API Docs: https://www.airwallex.com/docs/api
