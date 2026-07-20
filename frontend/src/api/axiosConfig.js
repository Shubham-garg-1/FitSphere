import axios from 'axios';
import { getToken } from '../utils/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle global errors (401, 403, 404, 500)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      switch (status) {
        case 401:
          error.message = 'Invalid Credentials';
          break;
        case 403:
          error.message = 'Unauthorized';
          break;
        case 404:
          error.message = 'Not Found';
          break;
        case 500:
          error.message = 'Server Error';
          break;
        default:
          if (error.response.data && error.response.data.message) {
            error.message = error.response.data.message;
          }
          break;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
