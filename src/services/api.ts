import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiUrl } from '../config';

const API_URL = getApiUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers['X-Auth-Token'] = token;
    }
    console.log('API Request:', {
      method: config.method,
      url: config.url,
      headers: config.headers,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  async (error) => {
    console.error('API Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    if (error.response?.status === 401) {
      // Handle unauthorized access
      await AsyncStorage.removeItem('token');
      // TODO: Dispatch logout action
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (email: string, password: string) => {
    console.log('Starting login process...');
    // First, get the token
    const loginResponse = await api.post('/api/auth', { email, password });
    console.log('Login response received:', loginResponse.data);
    
    if (loginResponse.status === 200) {
      const token = loginResponse.data.token;
      console.log('Token received, fetching user data...');
      
      // Then get the user data with the token
      const userResponse = await api.get('/api/auth', {
        headers: {
          'X-Auth-Token': token,
        },
      });
      
      console.log('User data received:', userResponse.data);
      
      if (userResponse.status === 200) {
        return {
          token,
          user: userResponse.data.user,
          orgId: userResponse.data.user.orgId,
        };
      }
    }
    
    throw new Error('Authentication failed');
  },

  register: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await api.post('/api/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token: string, password: string) => {
    const response = await api.post('/api/auth/reset-password', { token, password });
    return response.data;
  },
};

export default api; 