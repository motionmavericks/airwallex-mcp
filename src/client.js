import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Global client instance
let globalClient = null;

export class AirwallexClient {
  constructor(config = {}) {
    this.clientId = config.clientId || process.env.AIRWALLEX_CLIENT_ID;
    this.apiKey = config.apiKey || process.env.AIRWALLEX_API_KEY;
    this.environment = config.environment || process.env.AIRWALLEX_ENVIRONMENT || 'demo';
    
    // Set base URL based on environment
    this.baseUrl = this.environment === 'production' 
      ? 'https://api.airwallex.com'
      : 'https://api-demo.airwallex.com';
    
    // Token management
    this.token = null;
    this.tokenExpiry = null;
    
    // Create axios instance
    this.axios = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Add request interceptor to add auth token
    this.axios.interceptors.request.use(async (config) => {
      // Skip auth for login endpoint
      if (config.url === '/authentication/login') {
        return config;
      }
      
      // Ensure we have a valid token
      await this.ensureAuthenticated();
      
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      
      return config;
    });
  }
  
  async authenticate() {
    try {
      const response = await this.axios.post('/authentication/login', {}, {
        headers: {
          'x-client-id': this.clientId,
          'x-api-key': this.apiKey,
        },
      });
      
      this.token = response.data.token;
      // Token expires in 1 hour, we'll refresh 5 minutes before
      this.tokenExpiry = Date.now() + (55 * 60 * 1000);
      
      return {
        success: true,
        expiresAt: new Date(this.tokenExpiry).toISOString(),
      };
    } catch (error) {
      throw new Error(`Authentication failed: ${error.response?.data?.message || error.message}`);
    }
  }
  
  async ensureAuthenticated() {
    if (!this.token || Date.now() >= this.tokenExpiry) {
      await this.authenticate();
    }
  }
  
  isAuthenticated() {
    return this.token && Date.now() < this.tokenExpiry;
  }
  
  getAuthStatus() {
    if (!this.token) {
      return { authenticated: false };
    }
    
    return {
      authenticated: this.isAuthenticated(),
      expiresAt: new Date(this.tokenExpiry).toISOString(),
      environment: this.environment,
    };
  }
  
  // Helper methods for API calls
  async get(path, params = {}) {
    const response = await this.axios.get(path, { params });
    return response.data;
  }
  
  async post(path, data = {}) {
    const response = await this.axios.post(path, data);
    return response.data;
  }
  
  async put(path, data = {}) {
    const response = await this.axios.put(path, data);
    return response.data;
  }
  
  async delete(path) {
    const response = await this.axios.delete(path);
    return response.data;
  }
}

// Get or create global client instance
export function getClient() {
  if (!globalClient) {
    globalClient = new AirwallexClient();
  }
  return globalClient;
}

// Reset global client (useful for testing)
export function resetClient() {
  globalClient = null;
}
