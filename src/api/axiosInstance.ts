import axios, { AxiosInstance } from 'axios';
import { useAuthStore } from '../store/authStore';
import { Platform } from 'react-native';

// For development, we can use localhost or local network IP
// If server is running on the same machine, use local network IP.
// example url: 'http://237.84.2.178:3000/api';

const API_URL = 'http://192.168.1.167:3000/api';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach auth token
axiosInstance.interceptors.request.use(
  config => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

// Response interceptor: handle 401 + network errors
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      await useAuthStore.getState().clearAuth();
    }

    // Network error handling
    if (!error.response) {
      // Log network errors for debugging (in production, send to analytics)
      console.warn('[Network Error]', error.code, error.message);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
