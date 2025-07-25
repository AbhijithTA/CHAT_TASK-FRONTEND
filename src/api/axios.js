import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_SOCKET_URL}/api`
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userInfo') 
      ? JSON.parse(localStorage.getItem('userInfo')).token 
      : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;