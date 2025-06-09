import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaLock, FaUser, FaExclamationCircle, FaShoppingCart, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { TextInput, Button } from '../components/FormElements';

export default function LoginPage() {
  const { login, isAuthenticated, error: authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Obtener la ruta a la que redirigir después del login (si existe)
  const from = location.state?.from || '/';
  const action = location.state?.action || null;
  const registrationSuccess = location.state?.registrationSuccess || false;
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  
  // Estado de validación
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Controlar la redirección después de iniciar sesión
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Limpiar error específico cuando se edita un campo
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSubmitting(true);
      await login(formData.username, formData.password);
      // La redirección se maneja en el efecto useEffect
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al iniciar sesión');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Iniciar Sesión</h1>
          <p className="text-gray-600 mt-2">
            Accede a tu cuenta para ver tus pedidos y más
          </p>
          
          {/* Mensaje de redirección por acción */}
          {action === 'add_to_cart' && (
            <div className="mt-4 bg-blue-50 p-3 rounded-md flex items-center text-sm text-blue-800">
              <FaShoppingCart className="mr-2 text-blue-500" />
              Inicia sesión para añadir productos a tu carrito
            </div>
          )}
          
          {/* Mensaje de registro exitoso */}
          {registrationSuccess && (
            <div className="mt-4 bg-green-50 p-3 rounded-md flex items-center text-sm text-green-800">
              <FaCheckCircle className="mr-2 text-green-500" />
              ¡Registro exitoso! Ahora puedes iniciar sesión con tus credenciales.
            </div>
          )}
        </div>
        
        {/* Mensaje de error */}
        {(error || authError) && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md mb-6 flex items-center">
            <FaExclamationCircle className="mr-2 text-danger-500" />
            <span className="text-gray-700">{error || authError}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <TextInput
            label="Nombre de Usuario"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Ingresa tu nombre de usuario"
            required={true}
            error={errors.username}
            icon={<FaUser className="text-gray-400" />}
          />
          
          <TextInput
            label="Contraseña"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Ingresa tu contraseña"
            required={true}
            error={errors.password}
            icon={<FaLock className="text-gray-400" />}
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Recordarme
              </label>
            </div>
            
            <div className="text-sm">
              <a href="#" className="text-primary-500 hover:text-primary-600">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>
          
          <Button
            type="submit"
            className="btn-primary w-full"
            disabled={submitting}
          >
            {submitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Iniciando sesión...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <FaLock className="mr-2" />
                Iniciar Sesión
              </span>
            )}
          </Button>
        </form>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            ¿No tienes una cuenta?{' '}
            <Link to="/registro" className="text-primary-500 hover:text-primary-600 font-medium">
              Regístrate aquí
            </Link>
          </p>
          
          {/* Botón para volver a la página anterior */}
          {from !== '/' && (
            <div className="mt-4">
              <Link 
                to={from} 
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ← Volver a la página anterior
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 