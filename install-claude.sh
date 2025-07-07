#!/bin/bash

# Airwallex MCP Server Installation Script for Claude Code
# This script helps you install and configure the Airwallex MCP server

echo "==================================="
echo "Airwallex MCP Server Installer"
echo "==================================="
echo ""

# Check if running from the correct directory
if [ ! -f "package.json" ] || [ ! -f "src/index.js" ]; then
    echo "Error: Please run this script from the airwallex-mcp directory"
    exit 1
fi

# Get the current directory
CURRENT_DIR=$(pwd)

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "No .env file found. Let's create one..."
    echo ""
    
    # Copy from example
    cp .env.example .env
    
    # Prompt for credentials
    echo "Please enter your Airwallex API credentials:"
    echo "(You can find these in your Airwallex account under Settings → API Keys)"
    echo ""
    
    read -p "Client ID: " CLIENT_ID
    read -p "API Key: " API_KEY
    
    # Update .env file
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/your_client_id_here/$CLIENT_ID/g" .env
        sed -i '' "s/your_api_key_here/$API_KEY/g" .env
    else
        # Linux
        sed -i "s/your_client_id_here/$CLIENT_ID/g" .env
        sed -i "s/your_api_key_here/$API_KEY/g" .env
    fi
    
    echo ""
    echo "✓ Created .env file with your credentials"
else
    echo "✓ Found existing .env file"
fi

# Install dependencies
echo ""
echo "Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "Error: Failed to install dependencies"
    exit 1
fi

echo "✓ Dependencies installed"

# Add to Claude Code
echo ""
echo "Adding to Claude Code..."

# Check if claude command exists
if ! command -v claude &> /dev/null; then
    echo "Error: Claude Code CLI not found. Please ensure Claude Code is installed."
    exit 1
fi

# Add the MCP server
claude mcp add "$CURRENT_DIR" --name airwallex

if [ $? -eq 0 ]; then
    echo "✓ Successfully added Airwallex MCP server to Claude Code"
    echo ""
    echo "==================================="
    echo "Installation Complete!"
    echo "==================================="
    echo ""
    echo "The Airwallex MCP server has been installed and configured."
    echo ""
    echo "To start using it:"
    echo "1. Restart Claude Code"
    echo "2. The Airwallex tools will be available in your conversations"
    echo "3. Start by using 'airwallex_authenticate' to connect to the API"
    echo ""
    echo "For more information, see the README.md file"
else
    echo "Error: Failed to add MCP server to Claude Code"
    echo ""
    echo "You can try adding it manually with:"
    echo "claude mcp add $CURRENT_DIR --name airwallex"
    exit 1
fi
