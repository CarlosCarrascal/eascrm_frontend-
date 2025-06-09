import { axiosInstance } from './authService';
import axios from 'axios';

// URL base de la API
const API_URL = 'https://xvdarlin.pythonanywhere.com/api/';

// Crea una instancia de axios específica para consumir la API
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Instancia para API pública (sin token)
const publicClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token a las peticiones
apiClient.interceptors.request.use(
  (config) => {
    // Obtener token del localStorage (si existe)
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

// Interceptor para manejar respuestas
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejar errores específicos
    if (error.response) {
      // El servidor respondió con un código de error
      console.error('Error de respuesta:', error.response.data);
      
      // Manejar errores de autenticación
      if (error.response.status === 401) {
        console.error('Error de autenticación. Redirigiendo al login...');
        // Aquí podrías redirigir al login o disparar un evento
      }
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      console.error('Error de red:', error.request);
    } else {
      // Ocurrió un error al configurar la petición
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Aplicar el mismo interceptor para respuestas al cliente público
publicClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('Error de respuesta (API pública):', error.response.data);
    } else if (error.request) {
      console.error('Error de red (API pública):', error.request);
    } else {
      console.error('Error (API pública):', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Función de ayuda para convertir objetos a FormData
const toFormData = (object) => {
  const formData = new FormData();
  
  Object.keys(object).forEach(key => {
    // Si es una archivo o un array, añadirlo directamente
    if (object[key] instanceof File || Array.isArray(object[key])) {
      formData.append(key, object[key]);
    } 
    // Si es un objeto y no es null, convertirlo a JSON
    else if (typeof object[key] === 'object' && object[key] !== null) {
      formData.append(key, JSON.stringify(object[key]));
    } 
    // En otros casos, añadirlo como string
    else if (object[key] !== undefined && object[key] !== null) {
      formData.append(key, String(object[key]));
    }
  });
  
  return formData;
};

// Servicio para gestionar productos
export const productoService = {
  getAll: async (params = {}) => {
    try {
      // Usar el cliente público para listar productos (sin token)
      const response = await publicClient.get('productos/', { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  },
  
  getById: async (id) => {
    try {
      // Usar el cliente público para obtener un producto (sin token)
      const response = await publicClient.get(`productos/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener producto con ID ${id}:`, error);
      throw error;
    }
  },
  
  create: async (producto) => {
    try {
      const formData = toFormData(producto);
      const response = await apiClient.post('productos/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    }
  },
  
  update: async (id, producto) => {
    try {
      const formData = toFormData(producto);
      const response = await apiClient.put(`productos/${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar producto con ID ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id) => {
    try {
      await apiClient.delete(`productos/${id}/`);
      return true;
    } catch (error) {
      console.error(`Error al eliminar producto con ID ${id}:`, error);
      throw error;
    }
  },

  // Obtener pedidos que incluyen este producto (requiere autenticación)
  getPedidos: async (id) => {
    try {
      const response = await apiClient.get(`productos/${id}/pedidos/`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener pedidos del producto con ID ${id}:`, error);
      throw error;
    }
  },
};

// Servicio para gestionar clientes
export const clienteService = {
  getAll: async (params = {}) => {
    try {
      const response = await apiClient.get('clientes/', { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      throw error;
    }
  },
  
  getById: async (id) => {
    try {
      const response = await apiClient.get(`clientes/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener cliente con ID ${id}:`, error);
      throw error;
    }
  },
  
  create: async (cliente) => {
    try {
      const formData = toFormData(cliente);
      const response = await apiClient.post('clientes/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error al crear cliente:', error);
      throw error;
    }
  },
  
  update: async (id, cliente) => {
    try {
      const formData = toFormData(cliente);
      const response = await apiClient.put(`clientes/${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar cliente con ID ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id) => {
    try {
      await apiClient.delete(`clientes/${id}/`);
      return true;
    } catch (error) {
      console.error(`Error al eliminar cliente con ID ${id}:`, error);
      throw error;
    }
  },

  // Obtener pedidos de un cliente
  getPedidos: async (id) => {
    try {
      const response = await apiClient.get(`clientes/${id}/pedidos/`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener pedidos del cliente con ID ${id}:`, error);
      throw error;
    }
  },
};

// Servicio para gestionar pedidos
export const pedidoService = {
  getAll: async (params = {}) => {
    try {
      const response = await apiClient.get('pedidos/', { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
      throw error;
    }
  },
  
  getById: async (id) => {
    try {
      const response = await apiClient.get(`pedidos/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener pedido con ID ${id}:`, error);
      throw error;
    }
  },
  
  create: async (pedido) => {
    try {
      const response = await apiClient.post('pedidos/', pedido);
      return response.data;
    } catch (error) {
      console.error('Error al crear pedido:', error);
      throw error;
    }
  },
  
  update: async (id, pedido) => {
    try {
      const response = await apiClient.put(`pedidos/${id}/`, pedido);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar pedido con ID ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id) => {
    try {
      await apiClient.delete(`pedidos/${id}/`);
      return true;
    } catch (error) {
      console.error(`Error al eliminar pedido con ID ${id}:`, error);
      throw error;
    }
  },

  // Obtener detalles de un pedido
  getDetalles: async (id) => {
    try {
      const response = await apiClient.get(`pedidos/${id}/detalles/`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener detalles del pedido con ID ${id}:`, error);
      throw error;
    }
  },

  // Agregar producto a un pedido
  agregarProducto: async (id, producto) => {
    try {
      const response = await apiClient.post(`pedidos/${id}/agregar_producto/`, producto);
      return response.data;
    } catch (error) {
      console.error(`Error al agregar producto al pedido con ID ${id}:`, error);
      throw error;
    }
  },
};

// Servicio para obtener datos del dashboard
export const dashboardService = {
  getData: async () => {
    try {
      const response = await apiClient.get('dashboard/');
      return response.data;
    } catch (error) {
      console.error('Error al obtener datos del dashboard:', error);
      throw error;
    }
  },
}; 