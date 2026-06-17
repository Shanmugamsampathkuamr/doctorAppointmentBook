import axios from 'axios';
import { toast } from 'react-hot-toast'; // Highly recommended for notifications

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// Request Interceptor (Existing logic)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor (New logic)
api.interceptors.response.use(
  (response) => {
    // If your backend uses the ApiResponse wrapper, return just the 'data' part
    // This turns res.data.data into just res.data for your components
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || "Something went wrong";

    // Handle specific backend status codes
    if (error.response?.status === 409) {
      toast.error("Slot already taken! Please pick another time.");
    } else if (error.response?.status === 401) {
      toast.error("Session expired. Please login again.");
      localStorage.removeItem('token');
      // window.location.href = '/login'; // Optional: auto-redirect
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;