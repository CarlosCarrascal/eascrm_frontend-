import axios from 'axios';

const API_URL = 'https://xvdarlin.pythonanywhere.com/api/';

// Crear una instancia de axios con la configuración base
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token a las peticiones
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Funciones del servicio de autenticación
const authService = {
  // Registrar usuario
  register: async (userData) => {
    try {
      const response = await axios.post(API_URL + 'register/', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Iniciar sesión
  login: async (username, password) => {
    try {
      const response = await axios.post(API_URL + 'token/', {
        username,
        password,
      });
      if (response.data.access) {
        localStorage.setItem('token', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  },

  // Cerrar sesión
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  },

  // Renovar token
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await axios.post(API_URL + 'token/refresh/', {
        refresh: refreshToken,
      });
      
      if (response.data.access) {
        localStorage.setItem('token', response.data.access);
        return response.data;
      }
    } catch (error) {
      authService.logout();
      throw error;
    }
  },

  // Verificar si el usuario está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export { axiosInstance };
export default authService; 