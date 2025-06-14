import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaLock, FaUser, FaEnvelope, FaExclamationCircle, FaUserPlus, FaMapMarkerAlt } from 'react-icons/fa';
import { TextInput, Button } from '../components/FormElements';
import authService from '../services/authService';

export default function RegisterPage() {
  const navigate = useNavigate();
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
    direccion: ''
  });
  
  // Estado de validación
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

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
    
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (formData.password !== formData.password2) {
      newErrors.password2 = 'Las contraseñas no coinciden';
    }
    
    if (!formData.direccion.trim()) {
      newErrors.direccion = 'La dirección es requerida';
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
      
      // Llamar a la API de registro
      await authService.register(formData);
      
      setSuccess(true);
      
      // Redireccionar al login después de un registro exitoso
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            registrationSuccess: true 
          } 
        });
      }, 2000);
      
    } catch (err) {
      console.error('Error al registrar:', err);
      
      // Manejar diferentes tipos de errores
      if (err.response) {
        // El servidor respondió con un código de error
        const responseData = err.response.data;
        
        if (typeof responseData === 'string') {
          setError(responseData);
        } else if (responseData.error) {
          setError(responseData.error);
        } else if (responseData.detail) {
          setError(responseData.detail);
        } else if (responseData.username) {
          setError(responseData.username);
        } else if (responseData.email) {
          setError(responseData.email);
        } else if (responseData.password) {
          setError(responseData.password);
        } else if (responseData.non_field_errors) {
          setError(responseData.non_field_errors);
        } else {
          // Intentar mostrar todos los errores disponibles
          const errorMessages = [];
          Object.keys(responseData).forEach(key => {
            if (Array.isArray(responseData[key])) {
              errorMessages.push(`${key}: ${responseData[key].join(', ')}`);
            } else {
              errorMessages.push(`${key}: ${responseData[key]}`);
            }
          });
          
          if (errorMessages.length > 0) {
            setError(errorMessages.join('. '));
          } else {
            setError('Error al registrar usuario. Por favor, intenta de nuevo.');
          }
        }
      } else {
        // Error de red u otro tipo de error
        setError('Error de conexión. Por favor, verifica tu conexión a internet e intenta de nuevo.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Crear Cuenta</h1>
          <p className="text-gray-600 mt-2">
            Regístrate para acceder a todas las funciones
          </p>
        </div>
        
        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md mb-6 flex items-center">
            <FaExclamationCircle className="mr-2 text-danger-500" />
            <span className="text-gray-700">
              {error}
              {error.includes("ya está registrado como cliente") && (
                <div className="mt-2">
                  <Link to="/vincular-cliente" className="text-primary-500 hover:text-primary-600 font-medium">
                    Ir a vincular cuenta
                  </Link>
                </div>
              )}
            </span>
          </div>
        )}
        
        {/* Mensaje de éxito */}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-md mb-6 flex items-center">
            <FaUserPlus className="mr-2 text-success-500" />
            <span className="text-gray-700">¡Registro exitoso! Redirigiendo al inicio de sesión...</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Nombre"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="Tu nombre"
              error={errors.first_name}
            />
            
            <TextInput
              label="Apellido"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Tu apellido"
              error={errors.last_name}
            />
          </div>
          
          <TextInput
            label="Nombre de Usuario"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Elige un nombre de usuario"
            required={true}
            error={errors.username}
            icon={<FaUser className="text-gray-400" />}
          />
          
          <TextInput
            label="Correo Electrónico"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="tu@email.com"
            required={true}
            error={errors.email}
            icon={<FaEnvelope className="text-gray-400" />}
          />
          
          <TextInput
            label="Dirección"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            placeholder="Tu dirección completa"
            required={true}
            error={errors.direccion}
            icon={<FaMapMarkerAlt className="text-gray-400" />}
          />
          
          <TextInput
            label="Contraseña"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Crea una contraseña segura"
            required={true}
            error={errors.password}
            icon={<FaLock className="text-gray-400" />}
          />
          
          <TextInput
            label="Confirmar Contraseña"
            name="password2"
            type="password"
            value={formData.password2}
            onChange={handleChange}
            placeholder="Repite tu contraseña"
            required={true}
            error={errors.password2}
            icon={<FaLock className="text-gray-400" />}
          />
          
          <Button
            type="submit"
            className="btn-primary w-full"
            disabled={submitting || success}
          >
            {submitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registrando...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <FaUserPlus className="mr-2" />
                Crear Cuenta
              </span>
            )}
          </Button>
        </form>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="text-primary-500 hover:text-primary-600 font-medium">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 