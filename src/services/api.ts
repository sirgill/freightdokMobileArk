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

export async function getInvoiceLoads(page = 1, limit = 100) {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/load/invoice_loads?page=${page}&limit=${limit}`, {
    headers: {
      'x-auth-token': token || '',
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch delivered loads');
  }
  return await response.json();
}

export async function uploadLoadDocument(loadId: string, docType: string, file: any) {
  const token = await AsyncStorage.getItem('token');
  const formData = new FormData();
  // Use docType as the field name
  formData.append(docType, {
    uri: file.uri,
    name: file.name || `upload.${file.uri.split('.').pop()}`,
    type: file.mimeType || file.type || 'application/octet-stream',
  });
  const url = `/api/load/upload/load/${loadId}/${docType}`;
  // Debug logging
  // Note: _parts is a React Native FormData property, not standard. Use Object.keys as fallback.
  // @ts-ignore
  const formDataKeys = (formData as any)._parts ? (formData as any)._parts.map(([k]: [string, any]) => k) : Object.keys(formData);
  console.log('UPLOAD DEBUG: url', url);
  console.log('UPLOAD DEBUG: formData keys', formDataKeys);
  try {
    const response = await api.patch(url, formData, {
      headers: {
        'x-auth-token': token || '',
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('UPLOAD DEBUG: response', response.status, response.data);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to upload document');
    }
  } catch (err) {
    // Type guard for error
    if (typeof err === 'object' && err !== null && 'response' in err) {
      // @ts-ignore
      console.error('UPLOAD DEBUG: error', err.response?.data || err.message);
    } else {
      console.error('UPLOAD DEBUG: error', err);
    }
    throw err;
  }
}

export async function removeLoadDocument(loadId: string, docType: string, fileName: string) {
  const token = await AsyncStorage.getItem('token');
  const url = `/api/load/remove/doc/${loadId}/${docType}?doc_name=${encodeURIComponent(fileName)}`;
  console.log('REMOVE DOC DEBUG: url', url);
  try {
    const response = await api.delete(url, {
      headers: {
        'x-auth-token': token || '',
      },
    });
    console.log('REMOVE DOC DEBUG: response', response.status, response.data);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to remove document');
    }
  } catch (err) {
    if (typeof err === 'object' && err !== null && 'response' in err) {
      // @ts-ignore
      console.error('REMOVE DOC DEBUG: error', err.response?.data || err.message);
    } else {
      console.error('REMOVE DOC DEBUG: error', err);
    }
    throw err;
  }
}



export default api;
