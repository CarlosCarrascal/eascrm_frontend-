import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Componente para proteger rutas que requieren autenticación
 * Si el usuario no está autenticado, redirige al login guardando la ubicación actual
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Si está cargando, mostrar un indicador de carga
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading-spinner"></div>
        <span className="ml-2 text-gray-600">Verificando autenticación...</span>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location.pathname }}
        replace 
      />
    );
  }

  // Si está autenticado, mostrar el contenido
  return children;
} 