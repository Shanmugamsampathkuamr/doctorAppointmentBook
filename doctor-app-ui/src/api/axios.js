import axios from 'axios';
import { toast } from 'react-hot-toast';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    if (error.response?.status === 401) {
      toast.error('Session expired. Please login again.');
      localStorage.clear();
      window.location.href = '/login';
      return Promise.reject(error);
    }
    if (error.response?.status === 409) {
      toast.error('Slot already taken! Please pick another time.');
    } else if (error.response?.status !== 401) {
      toast.error(message);
    }
    return Promise.reject(error);
  }
);

export default api;
