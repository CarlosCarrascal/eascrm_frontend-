import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaExclamationTriangle, 
  FaClipboardList, 
  FaCalendarAlt, 
  FaMoneyBillWave, 
  FaUser, 
  FaBoxOpen, 
  FaReceipt, 
  FaInfoCircle, 
  FaTimesCircle,
  FaClock,
  FaShippingFast,
  FaCheck
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { pedidoService } from '../services/api';
import ImageWithFallback from '../components/ImageWithFallback';
import { productoService } from '../services/api';

export default function OrderDetailPage() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/pedidos/${id}` } });
    }
  }, [isAuthenticated, navigate, id]);

  // Cargar el pedido
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!isAuthenticated) return;
      
      try {
        setLoading(true);
        
        // Cargar información del pedido
        const orderResponse = await pedidoService.getById(id);
        setOrder(orderResponse);
        
        // Cargar detalles del pedido
        const detailsResponse = await pedidoService.getDetalles(id);
        console.log("Detalles del pedido obtenidos:", detailsResponse);
        
        // Si hay detalles, cargar información completa de cada producto
        if (detailsResponse && detailsResponse.length > 0) {
          const detailsWithProducts = await Promise.all(
            detailsResponse.map(async (detail) => {
              try {
                // Verificar si ya tenemos la información completa del producto
                if (detail.producto && typeof detail.producto === 'object' && detail.producto.imagen) {
                  console.log("Ya tenemos la información completa del producto:", detail.producto);
                  return detail;
                }
                
                // Si solo tenemos el ID del producto, obtener la información completa
                const productoId = typeof detail.producto === 'object' ? detail.producto.id : detail.producto;
                console.log(`Obteniendo información completa del producto ${productoId}`);
                
                const productoResponse = await productoService.getById(productoId);
                console.log("Producto obtenido:", productoResponse);
                
                // Devolver el detalle con la información completa del producto
                return {
                  ...detail,
                  producto: productoResponse
                };
              } catch (err) {
                console.error(`Error al obtener producto ${detail.producto}:`, err);
                return detail;
              }
            })
          );
          
          console.log("Detalles con productos completos:", detailsWithProducts);
          setOrderDetails(detailsWithProducts);
        } else {
          setOrderDetails(detailsResponse || []);
        }
      } catch (err) {
        console.error("Error al cargar detalles del pedido:", err);
        setError("No se pudieron cargar los detalles del pedido");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderDetails();
    }
  }, [id, isAuthenticated]);

  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Mapear estado a badge
  const getStatusBadge = (status) => {
    const statusMap = {
      pendiente: 'bg-yellow-100 text-yellow-800',
      en_proceso: 'bg-blue-100 text-blue-800',
      completado: 'bg-green-100 text-green-800',
      cancelado: 'bg-red-100 text-red-800',
    };
    
    const statusLabel = {
      pendiente: 'Pendiente',
      en_proceso: 'En Proceso',
      completado: 'Completado',
      cancelado: 'Cancelado',
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm ${statusMap[status] || 'bg-gray-100'}`}>
        {statusLabel[status] || status}
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-xl shadow-lg p-6 sm:p-8 mb-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute left-0 bottom-0 transform -translate-x-1/4 translate-y-1/4">
            <FaClipboardList size={300} />
          </div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center mb-4">
            <Link to="/pedidos" className="bg-white/20 hover:bg-white/30 transition-colors p-2 rounded-full mr-3">
              <FaArrowLeft className="text-white" />
            </Link>
            <h1 className="text-3xl font-bold text-white">Detalles del Pedido #{id}</h1>
          </div>
          
          {order && (
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
                <FaCalendarAlt className="mr-2" />
                <span>{formatDate(order.fecha)}</span>
              </div>
              {order.estado && (
                <div className={`px-4 py-2 rounded-full flex items-center 
                  ${order.estado === 'pendiente' ? 'bg-yellow-500/90' : ''}
                  ${order.estado === 'en_proceso' ? 'bg-blue-600/90' : ''}
                  ${order.estado === 'completado' ? 'bg-green-600/90' : ''}
                  ${order.estado === 'cancelado' ? 'bg-red-600/90' : ''}
                `}>
                  {order.estado === 'pendiente' && <FaClock className="mr-2" />}
                  {order.estado === 'en_proceso' && <FaShippingFast className="mr-2" />}
                  {order.estado === 'completado' && <FaCheck className="mr-2" />}
                  {order.estado === 'cancelado' && <FaExclamationTriangle className="mr-2" />}
                  <span className="capitalize">{order.estado}</span>
                </div>
              )}
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
                <FaMoneyBillWave className="mr-2" />
                <span>Total: {formatPrice(order.total)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Mensaje de error si existe */}
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-md mb-6 flex items-center">
          <FaExclamationTriangle className="text-red-500 mr-3 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
      
      {/* Contenido */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : order ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Información del pedido y productos */}
          <div className="md:col-span-2 space-y-6">
            {/* Información del cliente */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center">
                  <FaUser className="text-gray-500 mr-2" /> 
                  Información del Cliente
                </h2>
              </div>
              
              <div className="p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm">Cliente</p>
                    <p className="font-medium">{order.cliente?.nombre || 'Cliente #' + order.cliente}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Email</p>
                    <p className="font-medium">{order.cliente?.email || 'No disponible'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Teléfono</p>
                    <p className="font-medium">{order.cliente?.telefono || 'No disponible'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Dirección</p>
                    <p className="font-medium">{order.cliente?.direccion || 'No disponible'}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Detalles del pedido */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center">
                  <FaBoxOpen className="text-gray-500 mr-2" /> 
                  Productos del Pedido
                </h2>
                <span className="text-sm bg-gray-200 px-3 py-1 rounded-full">
                  {orderDetails.length} {orderDetails.length === 1 ? 'producto' : 'productos'}
                </span>
              </div>
              
              <div className="divide-y divide-gray-100">
                {orderDetails.map((detail) => (
                  <div key={detail.id} className="p-5 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      {/* Imagen del producto */}
                      <div className="w-24 h-24 mb-4 sm:mb-0 mr-0 sm:mr-5 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 hover:border-primary-300 transition-colors">
                        <ImageWithFallback
                          src={detail.producto?.imagen}
                          alt={detail.producto?.nombre}
                          className="w-full h-full object-cover"
                          fallbackText="Sin imagen"
                        />
                      </div>
                      
                      {/* Información del producto */}
                      <div className="flex-grow flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 mb-1">{detail.producto.nombre}</h3>
                          <p className="text-gray-500 text-sm mb-2">{detail.producto.descripcion?.substring(0, 80)}...</p>
                        </div>
                        
                        <div className="flex items-center justify-between sm:flex-col sm:items-end mt-3 sm:mt-0">
                          <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                            <span className="text-gray-600 text-sm mr-2">Cantidad:</span>
                            <span className="font-medium">{detail.cantidad}</span>
                          </div>
                          
                          <div className="flex flex-col items-end mt-2">
                            <div className="text-gray-500 text-sm">Precio unitario:</div>
                            <div className="font-semibold">{formatPrice(detail.precio_unitario)}</div>
                          </div>
                          
                          <div className="flex flex-col items-end mt-2">
                            <div className="text-gray-500 text-sm">Subtotal:</div>
                            <div className="font-bold text-primary-600">{formatPrice(detail.subtotal)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Resumen del pedido */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 sticky top-6">
              <div className="p-5 border-b border-gray-100 bg-gray-50">
                <h2 className="text-xl font-bold flex items-center">
                  <FaReceipt className="text-gray-500 mr-2" /> 
                  Resumen del Pedido
                </h2>
              </div>
              
              <div className="p-5">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatPrice(order.total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Envío</span>
                    <span className="text-green-600 font-medium">Gratis</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Impuestos</span>
                    <span className="font-medium">Incluidos</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">Total</span>
                      <span className="text-xl font-bold text-primary-600">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Estado del pedido */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-semibold mb-3 flex items-center">
                    <FaInfoCircle className="mr-2 text-gray-500" />
                    Estado del Pedido
                  </h3>
                  
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      {order.estado === 'pendiente' && <FaClock className="text-yellow-500 mr-2" />}
                      {order.estado === 'en_proceso' && <FaShippingFast className="text-blue-500 mr-2" />}
                      {order.estado === 'completado' && <FaCheck className="text-green-500 mr-2" />}
                      {order.estado === 'cancelado' && <FaExclamationTriangle className="text-red-500 mr-2" />}
                      <span className="font-medium capitalize">{order.estado}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {order.estado === 'pendiente' && 'Tu pedido está siendo procesado.'}
                      {order.estado === 'en_proceso' && 'Tu pedido está en proceso de preparación y envío.'}
                      {order.estado === 'completado' && '¡Tu pedido ha sido entregado con éxito!'}
                      {order.estado === 'cancelado' && 'Este pedido ha sido cancelado.'}
                    </p>
                  </div>
                </div>
                
                {/* Botones de acción */}
                {order.estado === 'pendiente' && (
                  <button
                    className="w-full mt-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center font-medium transition-colors"
                    onClick={() => {
                      // Implementar lógica para cancelar pedido
                      alert('Funcionalidad de cancelación aún no implementada');
                    }}
                  >
                    <FaTimesCircle className="mr-2" />
                    Cancelar Pedido
                  </button>
                )}
                
                <Link 
                  to="/pedidos" 
                  className="w-full mt-4 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg flex items-center justify-center font-medium transition-colors"
                >
                  <FaArrowLeft className="mr-2" />
                  Volver a Mis Pedidos
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <FaExclamationTriangle className="mx-auto text-yellow-500" size={48} />
          <h2 className="text-xl font-bold mt-4 mb-2">Pedido no encontrado</h2>
          <p className="text-gray-600 mb-6">
            No se pudo encontrar el pedido solicitado.
          </p>
          <Link to="/pedidos" className="btn btn-primary">
            Ver mis pedidos
          </Link>
        </div>
      )}
    </div>
  );
} 