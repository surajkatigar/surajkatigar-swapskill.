import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

// Interceptor to attach token from localStorage if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('swapskill_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
