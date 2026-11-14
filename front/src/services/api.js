import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Automatically inject the JWT token into every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('attendance_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
//chrome://flags/#unsafely-treat-insecure-origin-as-secure