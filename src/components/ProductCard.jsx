import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaPlus, FaMinus, FaCheck, FaRegEye, FaSignInAlt, FaStar, FaHeart } from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

export default function ProductCard({ producto }) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Manejar cambio de cantidad
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= producto.stock) {
      setQuantity(newQuantity);
    }
  };

  // Mostrar opciones de añadir al carrito
  const handleShowAddOptions = () => {
    if (!isAuthenticated) {
      // Redirigir a login si no está autenticado
      navigate('/login', { state: { from: window.location.pathname, action: 'add_to_cart' } });
      return;
    }
    setIsAdding(true);
  };

  // Añadir al carrito
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      // Redirigir a login si no está autenticado
      navigate('/login', { state: { from: window.location.pathname, action: 'add_to_cart' } });
      return;
    }
    
    addToCart(producto, quantity);
    setAdded(true);
    
    // Mostrar mensaje de confirmación por un momento
    setTimeout(() => {
      setAdded(false);
      setIsAdding(false);
      setQuantity(1);
    }, 1500);
  };

  // Ver detalles del producto
  const handleViewDetails = () => {
    navigate(`/productos/${producto.id}`);
  };

  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  const isOutOfStock = producto.stock === 0;
  const isLowStock = producto.stock > 0 && producto.stock < 5;
  
  // Generar estrellas de valoración aleatorias para demo
  const rating = Math.floor(Math.random() * 2) + 4; // Entre 4 y 5 estrellas
  const reviewCount = Math.floor(Math.random() * 50) + 10; // Entre 10 y 60 reseñas

  return (
    <div 
      className="relative group hover-lift rounded-xl overflow-hidden bg-white border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Imagen del producto con overlay */}
      <div className="relative h-48 overflow-hidden">
        {producto.imagen ? (
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">Sin imagen</span>
          </div>
        )}
        
        {/* Overlay de efecto de desenfoque */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        ></div>
        
        {/* Botones de acción rápida */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button 
            onClick={handleShowAddOptions}
            className="bg-white/90 text-primary-600 rounded-full p-3 hover:bg-white hover:text-primary-700 shadow-md transition-all hover:scale-110 duration-200"
            disabled={isOutOfStock}
            aria-label="Agregar al carrito"
          >
            <FaShoppingCart size={18} />
          </button>
          <button 
            onClick={handleViewDetails}
            className="bg-white/90 text-primary-600 rounded-full p-3 hover:bg-white hover:text-primary-700 shadow-md transition-all hover:scale-110 duration-200"
            aria-label="Ver detalles"
          >
            <FaRegEye size={18} />
          </button>
          <button 
            className="bg-white/90 text-primary-600 rounded-full p-3 hover:bg-white hover:text-primary-700 shadow-md transition-all hover:scale-110 duration-200"
            aria-label="Añadir a favoritos"
          >
            <FaHeart size={18} />
          </button>
        </div>
        
        {/* Etiquetas de producto */}
        <div className="absolute top-0 left-0 p-2 flex flex-col gap-2">
          {producto.precio < 20000 && (
            <span className="badge bg-green-500 text-white text-xs px-2 py-1 rounded">
              Oferta
            </span>
          )}
          {isLowStock && (
            <span className="badge bg-amber-500 text-white text-xs px-2 py-1 rounded">
              ¡Solo {producto.stock} disponibles!
            </span>
          )}
          {isOutOfStock && (
            <span className="badge bg-danger-500 text-white text-xs px-2 py-1 rounded">
              Agotado
            </span>
          )}
        </div>
      </div>
      
      {/* Contenido del producto */}
      <div className="p-4">
        {/* Categoría */}
        <p className="text-primary-500 text-sm font-medium mb-1">
          Categoría
        </p>
        
        {/* Nombre del producto */}
        <h3 className="text-gray-900 font-semibold text-lg mb-1 line-clamp-1">{producto.nombre}</h3>
        
        {/* Descripción */}
        <p className="text-gray-600 text-sm line-clamp-2 mb-2">{producto.descripcion}</p>
        
        {/* Valoraciones */}
        <div className="flex items-center mb-2">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} size={14} className={i < rating ? "text-amber-400" : "text-gray-300"} />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">({reviewCount})</span>
        </div>
        
        {/* Precio */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xl font-bold text-gray-900">{formatPrice(producto.precio)}</p>
            {producto.precio < 20000 && (
              <p className="text-xs text-gray-500 line-through">
                {formatPrice(producto.precio * 1.2)}
              </p>
            )}
          </div>
          
          {/* Stock status */}
          {!isOutOfStock && (
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
              En stock
            </span>
          )}
        </div>
      </div>
      
      {/* Botón de acción primaria */}
      <div className="p-4 pt-0 mt-2 border-t border-gray-100">
        {isAdding ? (
          <div className="flex flex-col space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-1">
              <button 
                onClick={() => handleQuantityChange(quantity - 1)}
                className="bg-white p-2 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                disabled={quantity <= 1}
                aria-label="Disminuir cantidad"
              >
                <FaMinus size={12} />
              </button>
              <span className="mx-2 font-medium text-gray-900">{quantity}</span>
              <button 
                onClick={() => handleQuantityChange(quantity + 1)}
                className="bg-white p-2 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                disabled={quantity >= producto.stock}
                aria-label="Aumentar cantidad"
              >
                <FaPlus size={12} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setIsAdding(false)}
                className="btn btn-outline btn-sm"
              >
                Cancelar
              </button>
              <button 
                onClick={handleAddToCart}
                className="btn btn-primary btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isOutOfStock}
              >
                {added ? (
                  <span className="flex items-center">
                    <FaCheck className="mr-1" /> Añadido
                  </span>
                ) : (
                  "Añadir"
                )}
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={handleShowAddOptions}
            className={`w-full btn ${isAuthenticated ? 'btn-primary' : 'btn-outline'} transition-all duration-300 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-90'}`}
            disabled={isOutOfStock}
          >
            {!isAuthenticated ? (
              <span className="flex items-center justify-center">
                <FaSignInAlt className="mr-2" />
                Iniciar sesión para comprar
              </span>
            ) : isOutOfStock ? (
              <span className="flex items-center justify-center text-gray-500">
                Sin stock
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <FaShoppingCart className="mr-2" />
                Añadir al carrito
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
} 