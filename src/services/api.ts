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
    console.log('Token from AsyncStorage:', token ? 'Token exists' : 'No token found');
    if (token) {
      config.headers['X-Auth-Token'] = token;
      console.log('Token added to headers:', config.headers['X-Auth-Token']);
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
    // Make a single POST request to /api/auth (same as frontend)
    const response = await api.post('/api/auth', { email, password });
    console.log('Login response received:', response.data);

    if (response.status === 200) {
      // The response should contain token and user data directly
      const { token, user } = response.data;
      console.log('Token and user data extracted:', { token: !!token, user: !!user });

      return {
        token,
        user,
        orgId: user?.orgId,
      };
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

export const getActiveLoads = async (page = 1) => {
  console.log('getActiveLoads called, page:', page);
  const token = await AsyncStorage.getItem('token');
  console.log('Current token in getActiveLoads:', token ? 'Token exists' : 'No token');

  const response = await api.get(`/api/load/me?page=${page}&limit=100`);
  console.log('Loads response structure:', {
    hasAllLoads: !!response.data.allLoads,
    allLoadsCount: response.data.allLoads?.length,
    hasLoad: true,
    loadCount: response.data.load?.length,
    total: response.data.total,
    currentPage: response.data.currentPage,
    totalPages: response.data.totalPages,
  });

  return {
    loads: response.data.load || [],
    currentPage: response.data.currentPage || page,
    totalPages: response.data.totalPages || 1,
  };
};

export const updateLoadStatus = async (loadId: string, status: string) => {
  console.log('updateLoadStatus called:', { loadId, status });
  
  try {
    const formData = new FormData();
    formData.append('_id', loadId);
    formData.append('status', status);
    
    const response = await api.patch('/api/load/modify', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('Status update response:', response.data);
    
    if (response.data.success) {
      return {
        success: true,
        data: response.data,
        message: 'Status updated successfully'
      };
    } else {
      throw new Error(response.data.message || 'Failed to update status');
    }
  } catch (error: any) {
    console.error('Status update error:', error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to update status');
  }
};

export const checkToken = async () => {
  const token = await AsyncStorage.getItem('token');
  console.log('Token check result:', token ? 'Token exists' : 'No token found');
  return token;
};

export default api;
