import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaShoppingBag, 
  FaEye, 
  FaClipboardList, 
  FaExclamationTriangle,
  FaCalendarAlt,
  FaBoxOpen,
  FaMoneyBillWave,
  FaClock,
  FaCheck,
  FaShippingFast,
  FaInfoCircle
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { pedidoService } from '../services/api';
import ImageWithFallback from '../components/ImageWithFallback';
import { productoService } from '../services/api';

export default function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Cargar pedidos
  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) return;
      
      try {
        setLoading(true);
        const response = await pedidoService.getAll();
        
        // Obtener detalles de cada pedido para mostrar productos
        const ordersWithDetails = await Promise.all(
          (response.results || []).map(async (order) => {
            try {
              const details = await pedidoService.getDetalles(order.id);
              console.log(`Detalles del pedido ${order.id}:`, details);
              
              // Obtener información completa de cada producto
              const detailsWithProducts = await Promise.all(
                (details || []).map(async (detail) => {
                  try {
                    // Verificar si ya tenemos información completa
                    if (detail.producto && typeof detail.producto === 'object' && detail.producto.imagen) {
                      return detail;
                    }
                    
                    // Si solo tenemos el ID, obtener información completa
                    const productoId = typeof detail.producto === 'object' ? detail.producto.id : detail.producto;
                    const productoResponse = await productoService.getById(productoId);
                    
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
              
              return { ...order, productos: detailsWithProducts || [] };
            } catch (err) {
              console.error(`Error al obtener detalles del pedido ${order.id}:`, err);
              return { ...order, productos: [] };
            }
          })
        );
        
        console.log("Todos los pedidos con detalles:", ordersWithDetails);
        setOrders(ordersWithDetails);
      } catch (err) {
        console.error("Error al cargar pedidos:", err);
        setError("No se pudieron cargar tus pedidos");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

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

  // Mapear estado a badge y color
  const getStatusInfo = (status) => {
    const statusMap = {
      pendiente: {
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        borderColor: 'border-yellow-200',
        icon: <FaClock className="mr-2" />,
        label: 'Pendiente'
      },
      en_proceso: {
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
        borderColor: 'border-blue-200',
        icon: <FaShippingFast className="mr-2" />,
        label: 'En Proceso'
      },
      completado: {
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        borderColor: 'border-green-200',
        icon: <FaCheck className="mr-2" />,
        label: 'Completado'
      },
      cancelado: {
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        borderColor: 'border-red-200',
        icon: <FaExclamationTriangle className="mr-2" />,
        label: 'Cancelado'
      },
    };
    
    // Si el estado no está en el mapa, usar valor por defecto
    return statusMap[status] || {
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800',
      borderColor: 'border-gray-200',
      icon: <FaInfoCircle className="mr-2" />,
      label: status
    };
  };

  // Si no está autenticado
  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center py-16 bg-white rounded-xl shadow-md">
          <FaClipboardList className="mx-auto text-gray-300" size={64} />
          <h2 className="text-2xl font-bold mt-4 mb-2">Inicia sesión para ver tus pedidos</h2>
          <p className="text-gray-600 mb-6">
            Necesitas iniciar sesión para acceder a tu historial de pedidos.
          </p>
          <Link to="/login" className="btn btn-primary">
            Iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Encabezado */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-xl shadow-lg p-6 sm:p-8 mb-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute left-0 bottom-0 transform -translate-x-1/4 translate-y-1/4">
            <FaClipboardList size={300} />
          </div>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-white">Mis Pedidos</h1>
            <p className="text-white/90 max-w-xl">
              Historial de todos tus pedidos realizados. Revisa el estado y los detalles de cada compra.
            </p>
          </div>
          
          <Link 
            to="/productos" 
            className="mt-4 md:mt-0 bg-white text-blue-600 hover:bg-blue-50 transition-colors px-6 py-3 rounded-lg font-medium shadow-md flex items-center justify-center"
          >
            <FaShoppingBag className="mr-2" />
            Explorar productos
          </Link>
        </div>
      </div>
      
      {/* Mensaje de error si existe */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-8 flex items-center">
          <FaExclamationTriangle className="text-red-500 mr-3 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {/* Lista de pedidos */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-500">Cargando tus pedidos...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-md">
          <FaShoppingBag className="mx-auto text-gray-300" size={64} />
          <h2 className="text-xl font-bold mt-4 mb-2">Aún no tienes pedidos</h2>
          <p className="text-gray-600 mb-6">
            ¡Explora nuestro catálogo y realiza tu primer pedido!
          </p>
          <Link to="/productos" className="btn btn-primary">
            Ver productos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => {
            const statusInfo = getStatusInfo(order.estado);
            
            return (
              <div 
                key={order.id} 
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full transform hover:-translate-y-1"
              >
                {/* Banda de estado en la parte superior */}
                <div className={`h-2 w-full ${statusInfo.bgColor.replace('bg-', 'bg-')}`}></div>
                
                <div className="p-6 flex-grow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`${statusInfo.bgColor} rounded-full p-3 mr-4`}>
                        <FaBoxOpen className={statusInfo.textColor} size={20} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Pedido #{order.id}</h3>
                        <div className="flex items-center text-gray-500 text-sm mt-1">
                          <FaCalendarAlt className="mr-1" size={12} />
                          <span>{formatDate(order.fecha)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`px-3 py-1 rounded-full text-sm flex items-center ${statusInfo.bgColor} ${statusInfo.textColor}`}>
                      {statusInfo.icon}
                      {statusInfo.label}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center my-4 py-3 border-t border-b border-gray-100">
                    <div className="text-sm">
                      <p className="text-gray-500">Productos</p>
                      <p className="font-semibold">{order.productos?.length || 0}</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-gray-500 text-sm">Total</p>
                      <p className="font-bold text-lg text-primary-600">{formatPrice(order.total)}</p>
                    </div>
                  </div>
                  
                  {/* Miniaturas de productos con efecto hover */}
                  {order.productos && order.productos.length > 0 && (
                    <div className="flex items-center space-x-2 mt-3 mb-4">
                      {order.productos.slice(0, 3).map((producto, index) => (
                        <div 
                          key={index} 
                          className="w-12 h-12 rounded-md overflow-hidden border border-gray-200 bg-white flex-shrink-0 hover:border-primary-300 transition-all hover:shadow-md"
                        >
                          <ImageWithFallback
                            src={producto.producto?.imagen}
                            alt={producto.producto?.nombre}
                            className="w-full h-full object-cover"
                            fallbackText="Sin img"
                          />
                        </div>
                      ))}
                      
                      {order.productos.length > 3 && (
                        <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600 hover:bg-gray-200 transition-colors">
                          +{order.productos.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="bg-gray-50 p-4 border-t border-gray-100">
                  <Link
                    to={`/pedidos/${order.id}`}
                    className="btn btn-primary w-full py-2.5 flex items-center justify-center hover:bg-primary-700 transition-colors"
                  >
                    <FaEye className="mr-2" />
                    Ver detalles
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
} 