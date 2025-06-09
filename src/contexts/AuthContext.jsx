import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

// Crear el contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentCliente, setCurrentCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar si hay un usuario autenticado al cargar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          try {
            // Obtener datos del usuario y cliente
            const userData = await authService.getCurrentUser();
            setCurrentUser(userData.user);
            setCurrentCliente(userData.cliente);
          } catch (err) {
            console.error('Error al obtener datos del usuario:', err);
            // Si hay error al obtener datos pero el token existe, mantener sesión
            setCurrentUser({ username: 'Usuario autenticado' });
          }
        }
      } catch (err) {
        console.error('Error al verificar autenticación:', err);
        setError('Error al verificar autenticación');
        // Limpiar tokens si hay error
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login
  const login = async (username, password) => {
    try {
      setError(null);
      const data = await authService.login(username, password);
      
      // Obtener datos del usuario y cliente
      try {
        const userData = await authService.getCurrentUser();
        setCurrentUser(userData.user);
        setCurrentCliente(userData.cliente);
      } catch (err) {
        // Si falla la obtención de datos, al menos establecer el nombre de usuario
        setCurrentUser({ username });
      }
      
      return data;
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setError(err.response?.data?.detail || 'Error al iniciar sesión');
      throw err;
    }
  };

  // Logout
  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    setCurrentCliente(null);
  };

  // Verificar si está autenticado
  const isAuthenticated = () => {
    return !!currentUser;
  };

  // Verificar si es cliente
  const isCliente = () => {
    return !!currentCliente;
  };

  const value = {
    currentUser,
    currentCliente,
    loading,
    error,
    login,
    logout,
    isAuthenticated: isAuthenticated(),
    isCliente: isCliente(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 