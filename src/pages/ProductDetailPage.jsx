import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaShoppingCart, 
  FaStar, 
  FaPlus, 
  FaMinus, 
  FaCheck,
  FaExclamationTriangle,
  FaShippingFast,
  FaCreditCard,
  FaBoxOpen,
  FaRegCheckCircle,
  FaShieldAlt
} from 'react-icons/fa';
import { productoService } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedTab, setSelectedTab] = useState('descripcion');
  
  // Cargar datos del producto
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await productoService.getById(id);
        setProduct(data);
      } catch (err) {
        console.error("Error al cargar el producto:", err);
        setError("No se pudo cargar la información del producto");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Manejar cambio de cantidad
  const handleQuantityChange = (newQuantity) => {
    if (!product) return;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  // Añadir al carrito
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/productos/${id}`, action: 'add_to_cart' } });
      return;
    }
    
    if (product) {
      addToCart(product, quantity);
      setAdded(true);
      
      // Mostrar mensaje de confirmación por unos segundos
      setTimeout(() => {
        setAdded(false);
      }, 2000);
    }
  };

  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  // Volver a la página anterior
  const handleGoBack = () => {
    navigate(-1);
  };

  const isOutOfStock = product?.stock === 0;
  const isLowStock = product?.stock > 0 && product?.stock < 5;
  
  // Generar estrellas de valoración aleatorias para demo
  const rating = Math.floor(Math.random() * 2) + 4; // Entre 4 y 5 estrellas
  const reviewCount = Math.floor(Math.random() * 50) + 10; // Entre 10 y 60 reseñas

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Migas de pan */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary-600">Inicio</Link>
        <span className="mx-2">›</span>
        <Link to="/productos" className="hover:text-primary-600">Productos</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-700">{product?.nombre || 'Detalle de producto'}</span>
      </div>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-500">Cargando detalles del producto...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg mb-6">
          <div className="flex items-center mb-4">
            <FaExclamationTriangle className="text-red-500 mr-3 flex-shrink-0" />
            <h3 className="text-lg font-semibold text-red-700">Error</h3>
          </div>
          <p className="text-gray-700">{error}</p>
          <button 
            onClick={handleGoBack}
            className="mt-4 btn btn-primary"
          >
            Volver al catálogo
          </button>
        </div>
      ) : product ? (
        <>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            {/* Sección superior con imagen y detalles básicos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Galería de imágenes */}
              <div className="relative p-6">
                <div className="relative mb-4 rounded-lg overflow-hidden bg-gray-100 aspect-square">
                  {product.imagen ? (
                    <img 
                      src={product.imagen} 
                      alt={product.nombre} 
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">Sin imagen</span>
                    </div>
                  )}
                </div>
                
                {/* Badges */}
                <div className="absolute top-8 left-8 flex flex-col gap-2">
                  {product.precio < 20000 && (
                    <span className="badge bg-green-500 text-white px-2 py-1 rounded-md text-xs">
                      Oferta
                    </span>
                  )}
                  {isLowStock && (
                    <span className="badge bg-amber-500 text-white px-2 py-1 rounded-md text-xs">
                      ¡Solo {product.stock} disponibles!
                    </span>
                  )}
                  {isOutOfStock && (
                    <span className="badge bg-red-500 text-white px-2 py-1 rounded-md text-xs">
                      Agotado
                    </span>
                  )}
                </div>
              </div>
              
              {/* Información del producto */}
              <div className="p-6 md:p-8 flex flex-col">
                <div className="flex-grow">
                  <p className="text-primary-600 text-sm font-medium mb-2">
                    Categoría
                  </p>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{product.nombre}</h1>
                  
                  {/* Valoraciones */}
                  <div className="flex items-center mb-4">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} size={14} className={i < rating ? "text-amber-400" : "text-gray-300"} />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">({reviewCount} valoraciones)</span>
                  </div>
                  
                  {/* Precio */}
                  <div className="mb-6">
                    <div className="flex items-center">
                      <p className="text-3xl font-bold text-gray-900">{formatPrice(product.precio)}</p>
                      {product.precio < 20000 && (
                        <p className="ml-3 text-sm text-gray-500 line-through">
                          {formatPrice(product.precio * 1.2)}
                        </p>
                      )}
                    </div>
                    
                    {product.precio < 20000 && (
                      <p className="text-green-600 text-sm mt-1">Ahorras: {formatPrice(product.precio * 0.2)}</p>
                    )}
                  </div>
                  
                  {/* Descripción corta */}
                  <div className="mb-6">
                    <p className="text-gray-600">{product.descripcion.substring(0, 150)}...</p>
                  </div>
                  
                  {/* Características rápidas */}
                  <div className="mb-6 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <FaRegCheckCircle className="text-green-500 mr-2" />
                      <span>Producto de alta calidad</span>
                    </div>
                    {!isOutOfStock && (
                      <div className="flex items-center text-sm text-gray-600">
                        <FaRegCheckCircle className="text-green-500 mr-2" />
                        <span>Disponible para entrega inmediata</span>
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                      <FaShieldAlt className="text-green-500 mr-2" />
                      <span>Garantía de 1 año</span>
                    </div>
                  </div>
                  
                  {/* Información de disponibilidad */}
                  <div className="mb-6">
                    <div className="flex items-center">
                      {isOutOfStock ? (
                        <span className="text-red-600 flex items-center">
                          <FaExclamationTriangle className="mr-2" />
                          Sin stock disponible
                        </span>
                      ) : (
                        <span className="text-green-600 flex items-center">
                          <FaCheck className="mr-2" />
                          En stock ({product.stock} disponibles)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Cantidad y añadir al carrito */}
                {!isOutOfStock && (
                  <div className="mt-auto">
                    <div className="flex items-center space-x-4 mb-4">
                      <span className="text-gray-700">Cantidad:</span>
                      <div className="flex items-center border border-gray-300 rounded-md shadow-sm">
                        <button 
                          onClick={() => handleQuantityChange(quantity - 1)}
                          className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          disabled={quantity <= 1}
                          aria-label="Disminuir cantidad"
                        >
                          <FaMinus size={12} />
                        </button>
                        <span className="px-4 py-2 border-x border-gray-300 min-w-[40px] text-center">{quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(quantity + 1)}
                          className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          disabled={quantity >= product.stock}
                          aria-label="Aumentar cantidad"
                        >
                          <FaPlus size={12} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button 
                        onClick={handleAddToCart}
                        className={`btn ${added ? 'btn-success' : 'btn-primary'} flex-grow py-3 flex items-center justify-center`}
                        disabled={isOutOfStock}
                      >
                        {added ? (
                          <span className="flex items-center">
                            <FaCheck className="mr-2" />
                            ¡Añadido al carrito!
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <FaShoppingCart className="mr-2" />
                            Añadir al carrito
                          </span>
                        )}
                      </button>
                      
                      <Link to="/carrito" className="btn btn-outline py-3 flex items-center justify-center">
                        Ver carrito
                      </Link>
                    </div>
                  </div>
                )}
                
                {isOutOfStock && (
                  <div className="w-full p-4 bg-gray-100 rounded-md text-center text-gray-700 mt-auto">
                    Este producto está temporalmente agotado
                  </div>
                )}
                
                {!isAuthenticated && !isOutOfStock && (
                  <Link 
                    to="/login" 
                    state={{ from: `/productos/${id}` }}
                    className="block w-full btn btn-primary mt-4 text-center py-3"
                  >
                    Iniciar sesión para comprar
                  </Link>
                )}
              </div>
            </div>
            
            {/* Pestañas de información detallada */}
            <div className="border-t border-gray-100">
              <div className="flex border-b border-gray-100 px-6">
                <button 
                  className={`py-4 px-4 font-medium text-sm border-b-2 transition-colors ${
                    selectedTab === 'descripcion' 
                      ? 'border-primary-600 text-primary-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setSelectedTab('descripcion')}
                >
                  Descripción
                </button>
                <button 
                  className={`py-4 px-4 font-medium text-sm border-b-2 transition-colors ${
                    selectedTab === 'detalles' 
                      ? 'border-primary-600 text-primary-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setSelectedTab('detalles')}
                >
                  Detalles de envío
                </button>
                <button 
                  className={`py-4 px-4 font-medium text-sm border-b-2 transition-colors ${
                    selectedTab === 'valoraciones' 
                      ? 'border-primary-600 text-primary-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setSelectedTab('valoraciones')}
                >
                  Valoraciones
                </button>
              </div>
              
              <div className="p-6">
                {selectedTab === 'descripcion' && (
                  <div className="prose max-w-none">
                    <h3 className="text-lg font-semibold mb-4">Descripción detallada</h3>
                    <p className="text-gray-700">{product.descripcion}</p>
                    
                    {/* Contenido adicional para demo */}
                    <p className="mt-4 text-gray-700">
                      Este producto es ideal para cualquier ocasión. Fabricado con los mejores materiales, 
                      garantiza durabilidad y satisfacción. Nuestros clientes lo recomiendan por su excelente 
                      relación calidad-precio.
                    </p>
                    
                    <ul className="mt-4 list-disc pl-5 space-y-2 text-gray-700">
                      <li>Alta calidad garantizada</li>
                      <li>Materiales premium</li>
                      <li>Diseño moderno y funcional</li>
                      <li>Fácil de usar y mantener</li>
                    </ul>
                  </div>
                )}
                
                {selectedTab === 'detalles' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Información de envío y pago</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="flex items-start">
                        <div className="bg-primary-100 rounded-full p-3 mr-4">
                          <FaShippingFast className="text-primary-600" size={18} />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Envío rápido</h4>
                          <p className="text-sm text-gray-600">Entrega en 24-48 horas para pedidos realizados antes de las 15:00</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-primary-100 rounded-full p-3 mr-4">
                          <FaBoxOpen className="text-primary-600" size={18} />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Devoluciones gratuitas</h4>
                          <p className="text-sm text-gray-600">30 días para devolver tu producto si no estás satisfecho</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-primary-100 rounded-full p-3 mr-4">
                          <FaCreditCard className="text-primary-600" size={18} />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Pago seguro</h4>
                          <p className="text-sm text-gray-600">Múltiples métodos de pago con encriptación SSL</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <h4 className="font-semibold mb-2">Política de envíos</h4>
                      <p className="text-sm text-gray-600">
                        Los envíos se realizan de lunes a viernes. Los pedidos realizados después de las 15:00 
                        se procesarán al día siguiente. No realizamos envíos los fines de semana o días festivos.
                      </p>
                    </div>
                  </div>
                )}
                
                {selectedTab === 'valoraciones' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold">Valoraciones de clientes</h3>
                      <div className="flex items-center">
                        <div className="flex text-amber-400 mr-2">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} size={16} className={i < rating ? "text-amber-400" : "text-gray-300"} />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">({reviewCount} valoraciones)</span>
                      </div>
                    </div>
                    
                    {/* Ejemplo de valoraciones */}
                    <div className="space-y-6">
                      <div className="border-b border-gray-100 pb-6">
                        <div className="flex justify-between mb-2">
                          <h4 className="font-medium">María García</h4>
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} size={12} className={i < 5 ? "text-amber-400" : "text-gray-300"} />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-500 text-sm mb-2">Hace 2 semanas</p>
                        <p className="text-gray-700">Excelente producto, cumple perfectamente con lo prometido. La entrega fue rápida y el producto llegó en perfectas condiciones.</p>
                      </div>
                      
                      <div className="border-b border-gray-100 pb-6">
                        <div className="flex justify-between mb-2">
                          <h4 className="font-medium">Carlos Rodríguez</h4>
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} size={12} className={i < 4 ? "text-amber-400" : "text-gray-300"} />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-500 text-sm mb-2">Hace 1 mes</p>
                        <p className="text-gray-700">Muy buen producto, la calidad es excepcional. Lo recomiendo sin dudarlo.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
} 