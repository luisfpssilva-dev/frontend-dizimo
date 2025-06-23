import axios from 'axios';

// Cria uma instância do Axios
const api = axios.create({
  baseURL: 'http://localhost:5000', // Altere para a URL do seu backend
});

// Intercepta as requisições para incluir o token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
