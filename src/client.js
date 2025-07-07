import axios from 'axios';

export class AirwallexClient {
  constructor(config) {
    this.clientId = config.clientId;
    this.apiKey = config.apiKey;
    this.environment = config.environment || 'demo';
    this.baseUrl = config.baseUrl || this.getDefaultBaseUrl();
    this.token = null;
    this.tokenExpiry = null;
    
    // Create axios instance with default config
    this.axios = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
    
    // Add request interceptor to add auth token
    this.axios.interceptors.request.use(
      async (config) => {
        // Skip auth header for login endpoint
        if (config.url.includes('/authentication/login')) {
          return config;
        }
        
        // Ensure we have a valid token
        if (!this.isAuthenticated()) {
          await this.authenticate();
        }
        
        config.headers['Authorization'] = `Bearer ${this.token}`;
        return config;
      },
      (error) => Promise.reject(error)
    );
    
    // Add response interceptor for better error handling
    this.axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 && !error.config.url.includes('/authentication/login')) {
          // Token expired, try to refresh
          this.token = null;
          this.tokenExpiry = null;
          
          // Retry the original request
          if (!error.config._retry) {
            error.config._retry = true;
            await this.authenticate();
            return this.axios(error.config);
          }
        }
        return Promise.reject(error);
      }
    );
  }
  
  getDefaultBaseUrl() {
    return this.environment === 'production' 
      ? 'https://api.airwallex.com/api/v1'
      : 'https://api-demo.airwallex.com/api/v1';
  }
  
  isAuthenticated() {
    if (!this.token || !this.tokenExpiry) {
      return false;
    }
    
    // Check if token is expired (with 5 minute buffer)
    const now = new Date().getTime();
    const expiryTime = new Date(this.tokenExpiry).getTime();
    return now < (expiryTime - 5 * 60 * 1000);
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
      
      // Token expires in 1 hour by default
      const expiresIn = response.data.expires_in || 3600;
      this.tokenExpiry = new Date(Date.now() + expiresIn * 1000).toISOString();
      
      return {
        success: true,
        token: this.token,
        expiresAt: this.tokenExpiry,
      };
    } catch (error) {
      console.error('Authentication failed:', error.response?.data || error.message);
      throw new Error(`Authentication failed: ${error.response?.data?.message || error.message}`);
    }
  }
  
  // Convenience method for GET requests
  async get(endpoint, params = {}) {
    const response = await this.axios.get(endpoint, { params });
    return response.data;
  }
  
  // Convenience method for POST requests
  async post(endpoint, data = {}) {
    const response = await this.axios.post(endpoint, data);
    return response.data;
  }
  
  // Convenience method for PUT requests
  async put(endpoint, data = {}) {
    const response = await this.axios.put(endpoint, data);
    return response.data;
  }
  
  // Convenience method for DELETE requests
  async delete(endpoint) {
    const response = await this.axios.delete(endpoint);
    return response.data;
  }
}