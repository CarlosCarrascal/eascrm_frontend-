import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUser, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaCamera, 
  FaCheck, 
  FaExclamationCircle
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { clienteService } from '../services/api';
import { TextInput, Button } from '../components/FormElements';

export default function ProfilePage() {
  const { currentUser, currentCliente, refreshUserData } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    direccion: '',
    foto: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [clienteData, setClienteData] = useState(null);
  
  // Función para refrescar los datos del cliente
  const refreshClienteData = async () => {
    try {
      console.log("Refrescando datos del cliente desde ProfilePage");
      // Usar la función del contexto de autenticación para actualizar los datos globalmente
      const userData = await refreshUserData();
      
      if (userData && userData.cliente) {
        setClienteData(userData.cliente);
        
        // Actualizar datos del formulario
        setFormData({
          nombre: userData.cliente.nombre || '',
          email: userData.cliente.email || '',
          direccion: userData.cliente.direccion || '',
          foto: null
        });
        
        // Actualizar preview de la imagen
        if (userData.cliente.foto) {
          // Añadir timestamp para evitar caché
          const fotoUrl = `${userData.cliente.foto}?t=${new Date().getTime()}`;
          console.log("Imagen actualizada recibida:", fotoUrl);
          setPreviewImage(fotoUrl);
        }
      }
    } catch (err) {
      console.error('Error al refrescar datos del cliente:', err);
    }
  };
  
  // Cargar datos del cliente
  useEffect(() => {
    console.log("ProfilePage: Efecto de montaje o cambio en currentCliente");
    if (currentCliente) {
      console.log("ProfilePage: Actualizando con datos de currentCliente:", currentCliente);
      setFormData({
        nombre: currentCliente.nombre || '',
        email: currentCliente.email || '',
        direccion: currentCliente.direccion || '',
        foto: null
      });
      
      // Si el cliente tiene una foto, mostrarla como preview
      if (currentCliente.foto) {
        // Asegurarse de que la URL tiene un timestamp para evitar caché
        const fotoUrl = currentCliente.foto.includes('?') 
          ? currentCliente.foto 
          : `${currentCliente.foto}?t=${new Date().getTime()}`;
        console.log("Cargando imagen inicial:", fotoUrl);
        setPreviewImage(fotoUrl);
      }
      
      setClienteData(currentCliente);
    }
  }, [currentCliente]);
  
  // Efecto para cargar datos frescos al montar el componente
  useEffect(() => {
    console.log("ProfilePage: Efecto de montaje");
    refreshClienteData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Redirigir si no hay usuario autenticado o cliente
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);
  
  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Manejar cambio de foto
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        foto: file
      });
      
      // Crear una URL para previsualizar la imagen
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
    }
  };
  
  // Trigger file input click
  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };
  
  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      if (!clienteData) {
        throw new Error('No se encontró información del cliente');
      }
      
      // Crear un FormData para enviar la imagen
      const formDataObj = new FormData();
      formDataObj.append('nombre', formData.nombre);
      formDataObj.append('email', formData.email);
      formDataObj.append('direccion', formData.direccion);
      
      let hasFoto = false;
      if (formData.foto) {
        formDataObj.append('foto', formData.foto);
        hasFoto = true;
        console.log("Enviando nueva foto:", formData.foto.name);
      }
      
      // Actualizar cliente
      console.log("Enviando actualización para cliente ID:", clienteData.id);
      const updatedCliente = await clienteService.update(clienteData.id, formDataObj);
      console.log("Cliente actualizado:", updatedCliente);
      
      // Refrescar datos del cliente y usuario globalmente
      await refreshClienteData();
      
      // Actualizar la vista previa con la nueva URL de la foto
      if (updatedCliente.foto) {
        const fotoUrl = `${updatedCliente.foto}?t=${new Date().getTime()}`;
        console.log("Nueva URL de foto:", fotoUrl);
        setPreviewImage(fotoUrl);
      }
      
      setSuccess(true);
      
      // Si se subió una nueva foto, forzar una recarga de la página después de unos segundos
      if (hasFoto) {
        setTimeout(() => {
          console.log("Recargando página para refrescar la foto...");
          window.location.reload();
        }, 1500);
      } else {
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
      setError(err.message || 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };
  
  // Si no hay cliente, mostrar mensaje
  if (!clienteData && currentUser) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4 text-white">Mi Perfil</h1>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md">
            <p className="text-blue-700">
              No tienes un perfil de cliente asociado a tu cuenta. Por favor, contacta con el administrador.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Encabezado */}
        <div className="bg-primary-600 p-6 text-white">
          <h1 className="text-2xl font-bold text-white">Mi Perfil</h1>
          <p className="text-white/80 mt-1">Administra tu información personal</p>
        </div>
        
        {/* Mensajes de éxito o error */}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mx-6 mt-6 rounded-md flex items-center">
            <FaCheck className="text-green-500 mr-2" />
            <span className="text-green-700">Perfil actualizado correctamente</span>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-6 mt-6 rounded-md flex items-center">
            <FaExclamationCircle className="text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        )}
        
        <div className="p-6">
          {/* Información del usuario */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Información de la cuenta</h2>
            <div className="flex items-center">
              <div className="bg-gray-100 p-3 rounded-full">
                <FaUser className="text-gray-500" size={20} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Nombre de usuario</p>
                <p className="font-medium">{currentUser?.username}</p>
              </div>
            </div>
            <div className="flex items-center mt-4">
              <div className="bg-gray-100 p-3 rounded-full">
                <FaEnvelope className="text-gray-500" size={20} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Correo electrónico</p>
                <p className="font-medium">{currentUser?.email}</p>
              </div>
            </div>
          </div>
          
          {/* Formulario */}
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <h2 className="text-lg font-semibold mb-4">Información del cliente</h2>
            
            {/* Foto de perfil */}
            <div className="mb-6 flex flex-col items-center">
              <div 
                className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-3 relative cursor-pointer group"
                onClick={handlePhotoClick}
              >
                {previewImage ? (
                  <img 
                    src={previewImage} 
                    alt="Foto de perfil" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <FaUser className="text-gray-400" size={64} />
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <FaCamera className="text-white" size={24} />
                </div>
              </div>
              
              <p className="text-sm text-gray-500 mb-2">Haz clic para cambiar tu foto</p>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            
            <div className="grid gap-6 mb-6 md:grid-cols-2">
              <TextInput
                label="Nombre completo"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Tu nombre completo"
                required={true}
                icon={<FaUser className="text-gray-400" />}
              />
              
              <TextInput
                label="Correo electrónico"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                required={true}
                icon={<FaEnvelope className="text-gray-400" />}
                disabled={true}
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="direccion">
                Dirección
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaMapMarkerAlt className="text-gray-400" />
                </div>
                <textarea
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  className="w-full pl-10 py-2 pr-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  rows="3"
                  placeholder="Tu dirección completa"
                ></textarea>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar cambios'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 