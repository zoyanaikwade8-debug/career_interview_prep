import axios from 'axios';

const isProd = import.meta.env.PROD;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (isProd ? 'https://career-interview-prep.onrender.com/api' : 'http://localhost:5000/api'),
});

// Add a request interceptor to automatically attach the token
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
