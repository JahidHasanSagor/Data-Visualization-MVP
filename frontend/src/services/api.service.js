import axios from '../utils/axios';

// Base API service with common methods
class ApiService {
  constructor(resource) {
    this.resource = resource;
  }

  getUrl(path = '') {
    return `${this.resource}${path ? `/${path}` : ''}`;
  }

  async get(path = '', config = {}) {
    return axios.get(this.getUrl(path), config);
  }

  async post(path = '', data = {}, config = {}) {
    return axios.post(this.getUrl(path), data, config);
  }

  async put(path = '', data = {}, config = {}) {
    return axios.put(this.getUrl(path), data, config);
  }

  async delete(path = '', config = {}) {
    return axios.delete(this.getUrl(path), config);
  }
}

// Auth service
export class AuthService extends ApiService {
  constructor() {
    super('/api/auth');
  }

  async login(email, password) {
    try {
      const response = await this.post('login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { success: true, user };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  }

  async register(name, email, password) {
    try {
      const response = await this.post('register', { name, email, password });
      return { success: true, message: response.data.message };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      };
    }
  }

  async logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    return { success: true };
  }

  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await this.post('refresh-token', { refresh_token: refreshToken });
      const { token } = response.data;
      
      localStorage.setItem('authToken', token);
      
      return { success: true, token };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Token refresh failed' 
      };
    }
  }
}

// User service
export class UserService extends ApiService {
  constructor() {
    super('/api/user');
  }

  async getProfile() {
    try {
      const response = await this.get('profile');
      return { success: true, user: response.data.user };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to get profile' 
      };
    }
  }

  async updateProfile(userData) {
    try {
      const response = await this.put('profile', userData);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return { success: true, user: response.data.user };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to update profile' 
      };
    }
  }
}

// Integration service
export class IntegrationService extends ApiService {
  constructor() {
    super('/api/integrations');
  }

  async getStatus() {
    try {
      const response = await this.get('status');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to get integration status' 
      };
    }
  }

  async getGoogleAuthUrl() {
    try {
      const response = await this.get('google/auth-url');
      return { success: true, authUrl: response.data.auth_url };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to get Google auth URL' 
      };
    }
  }

  async getMetaAuthUrl() {
    try {
      const response = await this.get('meta/auth-url');
      return { success: true, authUrl: response.data.auth_url };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to get Meta auth URL' 
      };
    }
  }

  async disconnectIntegration(platform) {
    try {
      await this.post(`${platform}/disconnect`);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || `Failed to disconnect ${platform}` 
      };
    }
  }

  async getIntegrationData(platform) {
    try {
      const response = await this.get(`${platform}/data`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || `Failed to get ${platform} data` 
      };
    }
  }
}

// Dashboard service
export class DashboardService extends ApiService {
  constructor() {
    super('/api/dashboard');
  }

  async getData() {
    try {
      const response = await this.get('data');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to get dashboard data' 
      };
    }
  }

  async saveSettings(settings) {
    try {
      const response = await this.post('settings', settings);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to save dashboard settings' 
      };
    }
  }
}

// Upload service
export class UploadService extends ApiService {
  constructor() {
    super('/api/upload');
  }

  uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file);
    
    return this.post('', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  async getUploadedFiles() {
    try {
      const response = await this.get();
      return { success: true, files: response.data.files };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to get uploaded files' 
      };
    }
  }
}

// Create instances of services
export const authService = new AuthService();
export const userService = new UserService();
export const integrationService = new IntegrationService();
export const dashboardService = new DashboardService();
export const uploadService = new UploadService(); 