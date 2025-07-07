#!/usr/bin/env node

// Test authentication with Airwallex API
import { AirwallexClient } from '../src/client.js';
import dotenv from 'dotenv';

dotenv.config();

async function testAuthentication() {
  console.log('Testing Airwallex Authentication...\n');
  
  try {
    const client = new AirwallexClient({
      clientId: process.env.AIRWALLEX_CLIENT_ID,
      apiKey: process.env.AIRWALLEX_API_KEY,
      environment: process.env.AIRWALLEX_ENVIRONMENT || 'demo',
    });
    
    console.log('Environment:', client.environment);
    console.log('Base URL:', client.baseUrl);
    console.log('\nAuthenticating...');
    
    const result = await client.authenticate();
    
    console.log('\n✓ Authentication successful!');
    console.log('Token expires at:', result.expiresAt);
    
    // Test getting account details
    console.log('\nFetching account details...');
    const account = await client.get('/account');
    
    console.log('\n✓ Account details retrieved:');
    console.log('- Account ID:', account.id);
    console.log('- Company Name:', account.company_name);
    console.log('- Status:', account.status);
    
  } catch (error) {
    console.error('\n✗ Test failed:', error.message);
    if (error.response?.data) {
      console.error('API Response:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

testAuthentication();