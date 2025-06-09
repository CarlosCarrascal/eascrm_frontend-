import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaTrash, 
  FaPlus, 
  FaMinus, 
  FaArrowLeft, 
  FaShoppingBag, 
  FaCheck, 
  FaShoppingCart,
  FaCreditCard,
  FaBox,
  FaTruck
} from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { pedidoService } from '../services/api';

export default function CartPage() {
  const { cart, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  // Manejar cambio de cantidad
  const handleQuantityChange = (productId, newQuantity, maxStock) => {
    if (newQuantity >= 1 && newQuantity <= maxStock) {
      updateQuantity(productId, newQuantity);
    }
  };

  // Finalizar compra
  const handleCheckout = async () => {
    if (!isAuthenticated) {
      // Redireccionar a login si no está autenticado
      navigate('/login', { state: { from: '/carrito' } });
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Crear el pedido
      const pedido = {
        cliente: 1, // Este debería ser el ID del cliente autenticado
        estado: 'pendiente',
        detalles: cart.map(item => ({
          producto: item.id,
          cantidad: item.cantidad
        }))
      };

      // Enviar al backend
      await pedidoService.create(pedido);
      
      // Limpiar carrito y mostrar mensaje de éxito
      clearCart();
      setSuccess(true);
      
      // Redirigir a la página de pedidos después de un breve retraso
      setTimeout(() => {
        navigate('/pedidos');
      }, 3000);
    } catch (err) {
      console.error("Error al procesar el pedido:", err);
      setError(err.response?.data?.detail || "No se pudo procesar el pedido");
    } finally {
      setLoading(false);
    }
  };

  // Si el carrito está vacío
  if (cart.length === 0 && !success) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
          <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaShoppingCart className="text-gray-400" size={48} />
          </div>
          <h2 className="text-2xl font-bold mt-4 mb-2">Tu carrito está vacío</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Parece que aún no has añadido ningún producto a tu carrito. 
            ¡Explora nuestro catálogo y encuentra productos increíbles!
          </p>
          <Link to="/productos" className="btn btn-primary px-8 py-3">
            Explorar productos
          </Link>
        </div>
      </div>
    );
  }

  // Si el pedido se ha completado con éxito
  if (success) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center py-16 bg-white rounded-xl shadow-md">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheck className="text-white" size={36} />
          </div>
          <h2 className="text-2xl font-bold mt-4 mb-2">¡Pedido realizado con éxito!</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Tu pedido ha sido recibido y está siendo procesado. Pronto recibirás una confirmación.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Link to="/pedidos" className="btn btn-primary">
              Ver mis pedidos
            </Link>
            <Link to="/productos" className="btn btn-outline">
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold">Tu Carrito</h1>
        <Link to="/productos" className="mt-2 md:mt-0 text-primary-600 hover:text-primary-700 flex items-center group">
          <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Continuar comprando
        </Link>
      </div>
      
      {/* Mensaje de error si existe */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6 flex items-center">
          <span className="mr-2">⚠️</span>
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de productos en el carrito */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold">Productos en tu carrito ({cart.length})</h2>
            </div>
            
            {cart.map((item) => (
              <div key={item.id} className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center hover:bg-gray-50 transition-colors">
                {/* Imagen y nombre */}
                <div className="flex items-center flex-grow mb-4 sm:mb-0">
                  {item.imagen ? (
                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      className="w-16 h-16 object-cover rounded-lg mr-4"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-lg mr-4 flex items-center justify-center">
                      <span className="text-gray-500 text-xs">Sin imagen</span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium text-gray-900">{item.nombre}</h3>
                    <p className="text-sm text-gray-500 mt-1">Precio unitario: {formatPrice(item.precio)}</p>
                  </div>
                </div>
                
                {/* Cantidad y subtotal */}
                <div className="flex items-center justify-between sm:w-72">
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.cantidad - 1, item.stock)}
                      className="px-3 py-1 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                      disabled={item.cantidad <= 1}
                      aria-label="Disminuir cantidad"
                    >
                      <FaMinus size={10} />
                    </button>
                    <span className="px-3 py-1 border-x border-gray-300 min-w-[40px] text-center">{item.cantidad}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.cantidad + 1, item.stock)}
                      className="px-3 py-1 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                      disabled={item.cantidad >= item.stock}
                      aria-label="Aumentar cantidad"
                    >
                      <FaPlus size={10} />
                    </button>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-medium">{formatPrice(item.precio * item.cantidad)}</div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-sm text-red-600 hover:text-red-700 mt-1 flex items-center"
                    >
                      <FaTrash size={10} className="mr-1" /> Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Vaciar carrito */}
            <div className="p-6 flex justify-end">
              <button
                onClick={clearCart}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Vaciar carrito
              </button>
            </div>
          </div>
        </div>
        
        {/* Resumen del pedido */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold mb-6 pb-4 border-b border-gray-100">Resumen del pedido</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Envío</span>
                <span className="text-green-600">Gratis</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Impuestos</span>
                <span>Incluidos</span>
              </div>
            </div>
            
            <div className="flex justify-between font-bold text-lg py-4 border-t border-gray-100">
              <span>Total</span>
              <span className="text-primary-600">{formatPrice(total)}</span>
            </div>
            
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="btn btn-primary w-full py-3 mt-6 flex items-center justify-center"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </span>
              ) : (
                <>
                  <FaCreditCard className="mr-2" />
                  Finalizar compra
                </>
              )}
            </button>
            
            {/* Información adicional */}
            <div className="mt-8 space-y-4 text-sm text-gray-600">
              <div className="flex items-start">
                <FaTruck className="text-primary-500 mt-1 mr-3 flex-shrink-0" />
                <span>Envío gratuito en todos los pedidos</span>
              </div>
              <div className="flex items-start">
                <FaBox className="text-primary-500 mt-1 mr-3 flex-shrink-0" />
                <span>Devoluciones gratuitas hasta 30 días después de la compra</span>
              </div>
              <div className="flex items-start">
                <FaCreditCard className="text-primary-500 mt-1 mr-3 flex-shrink-0" />
                <span>Pagos seguros con encriptación SSL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 