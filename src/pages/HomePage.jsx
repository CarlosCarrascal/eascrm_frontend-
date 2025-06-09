import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaArrowRight, 
  FaUtensils, 
  FaShoppingBag, 
  FaClock, 
  FaExclamationTriangle,
  FaStar,
  FaShippingFast,
  FaCreditCard,
  FaUserFriends,
  FaCheck
} from 'react-icons/fa';
import { productoService } from '../services/api';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../contexts/AuthContext';

// Productos de ejemplo solo para mostrar cuando hay problemas (usados como último recurso)
const SAMPLE_PRODUCTS = [
  {
    id: 1,
    nombre: 'Pizza Margarita',
    descripcion: 'Pizza clásica con queso mozzarella, tomate y albahaca',
    precio: 8990,
    stock: 10,
    imagen: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 2,
    nombre: 'Hamburguesa Clásica',
    descripcion: 'Hamburguesa con carne de res, lechuga, tomate y queso cheddar',
    precio: 7990,
    stock: 15,
    imagen: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 3,
    nombre: 'Ensalada César',
    descripcion: 'Lechuga romana, crutones, pollo grillado, queso parmesano y aderezo césar',
    precio: 6990,
    stock: 8,
    imagen: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 4,
    nombre: 'Pasta Carbonara',
    descripcion: 'Espaguetis con salsa cremosa, tocino, huevo y queso parmesano',
    precio: 9990,
    stock: 5,
    imagen: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
];

export default function HomePage() {
  const { isAuthenticated, login } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authRequired, setAuthRequired] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Cargar productos destacados
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        setAuthRequired(false);
        
        // Obtener productos con orden por stock (para mostrar los más disponibles)
        const response = await productoService.getAll({ ordering: '-stock', page_size: 4 });
        setFeaturedProducts(response.results || []);
      } catch (err) {
        console.error("Error al cargar productos destacados:", err);
        
        if (err.response && err.response.status === 401 && !isAuthenticated) {
          setError("Se requiere autenticación para ver los productos");
          setAuthRequired(true);
        } else {
          setError("No se pudieron cargar los productos destacados");
          
          // Como último recurso, si hay demasiados errores, mostrar productos de ejemplo
          if (retryCount > 2) {
            console.warn("Mostrando productos de ejemplo después de múltiples intentos fallidos");
            setFeaturedProducts(SAMPLE_PRODUCTS);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, [isAuthenticated, retryCount]);

  // Reintentar cargar productos
  const handleRetry = () => {
    setRetryCount(retryCount + 1);
  };

  // Testimonios de clientes (datos simulados)
  const testimonials = [
    {
      id: 1,
      name: "María González",
      role: "Cliente frecuente",
      comment: "EasyCRM ha mejorado significativamente mi experiencia de compra. La interfaz es intuitiva y los productos siempre llegan a tiempo.",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/women/32.jpg"
    },
    {
      id: 2,
      name: "Carlos Vega",
      role: "Cliente nuevo",
      comment: "Sorprendido por la calidad de servicio. La plataforma es fácil de usar y el proceso de pedido es rápido y eficiente.",
      rating: 4,
      avatar: "https://randomuser.me/api/portraits/men/54.jpg"
    },
    {
      id: 3,
      name: "Laura Martínez",
      role: "Cliente corporativo",
      comment: "Hemos mejorado nuestra gestión de inventario gracias a EasyCRM. El sistema es robusto y confiable.",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/women/68.jpg"
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero section - Moderno y atractivo */}
      <section className="relative overflow-hidden">
        {/* Fondo con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-100 via-primary-200 to-secondary-100 opacity-95"></div>
        
        {/* Patrón decorativo */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary-400"></div>
          <div className="absolute top-1/2 left-20 w-64 h-64 rounded-full bg-secondary-300"></div>
          <div className="absolute -bottom-20 right-1/3 w-80 h-80 rounded-full bg-primary-300"></div>
        </div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <span className="inline-block px-4 py-1 rounded-full bg-primary-700 text-white text-sm font-medium mb-6">
                La plataforma de gestión de productos #1
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-800">
                La mejor experiencia para tus <span className="text-primary-600">clientes</span>
              </h1>
              <p className="text-lg md:text-xl mb-8 text-gray-700 max-w-lg">
                Gestiona tus productos, pedidos y clientes de forma sencilla y eficiente. 
                Todo lo que necesitas para hacer crecer tu negocio.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/productos"
                  className="btn btn-lg bg-primary-700 text-white hover:bg-primary-800 hover:shadow-lg transition-all"
                >
                  Ver productos <FaArrowRight className="ml-2" />
                </Link>
                {!isAuthenticated && (
                  <Link
                    to="/login"
                    className="btn btn-lg bg-transparent border-2 border-primary-600 text-primary-700 hover:bg-primary-50 transition-all"
                  >
                    Iniciar sesión
                  </Link>
                )}
              </div>
              
              {/* Stats */}
              <div className="mt-12 flex flex-wrap gap-8 text-center">
                <div>
                  <p className="text-3xl font-bold text-gray-800">1000+</p>
                  <p className="text-gray-600 text-sm">Productos</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-800">5000+</p>
                  <p className="text-gray-600 text-sm">Clientes satisfechos</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-800">24/7</p>
                  <p className="text-gray-600 text-sm">Soporte</p>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2 relative">
              {/* Imagen principal con efectos visuales */}
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500 border-2 border-white">
                <img
                  src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="EasyCRM en acción"
                  className="w-full h-auto object-cover"
                  style={{maxHeight: "460px"}}
                />
                {/* Overlay para mejorar legibilidad */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/40 to-transparent"></div>
                
                {/* Insignia flotante */}
                <div className="absolute bottom-4 left-4 bg-white shadow-lg p-3 flex items-center transform hover:scale-105 transition-transform rounded-lg">
                  <FaStar className="text-primary-600 mr-2" />
                  <span className="font-medium text-gray-800">Valoración 4.9/5</span>
                </div>
              </div>
              
              {/* Elementos decorativos alrededor de la imagen */}
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-secondary-400 rounded-lg -z-10"></div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary-500 rounded-full opacity-70 -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de beneficios */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4">
              Por qué elegirnos
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Diseñado para hacer crecer tu negocio
            </h2>
            <p className="text-lg text-gray-600">
              Nuestras herramientas te ayudan a ofrecer una experiencia excepcional a tus clientes
              y a gestionar tu negocio de manera eficiente.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Beneficio 1 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 rounded-full bg-primary-500/10 flex items-center justify-center mb-6">
                <FaUtensils className="text-primary-500 text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Calidad premium</h3>
              <p className="text-gray-600">
                Ofrecemos productos de la más alta calidad con las mejores materias primas disponibles.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <FaCheck className="text-primary-500 mr-2 flex-shrink-0" />
                  <span>Selección rigurosa</span>
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <FaCheck className="text-primary-500 mr-2 flex-shrink-0" />
                  <span>Control de calidad</span>
                </li>
              </ul>
            </div>
            
            {/* Beneficio 2 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 rounded-full bg-secondary-500/10 flex items-center justify-center mb-6">
                <FaShoppingBag className="text-secondary-500 text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Compra sencilla</h3>
              <p className="text-gray-600">
                Proceso de pedido intuitivo y rápido con una experiencia de usuario excepcional.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <FaCheck className="text-secondary-500 mr-2 flex-shrink-0" />
                  <span>Interfaz intuitiva</span>
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <FaCheck className="text-secondary-500 mr-2 flex-shrink-0" />
                  <span>Checkout simplificado</span>
                </li>
              </ul>
            </div>
            
            {/* Beneficio 3 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 rounded-full bg-accent-500/10 flex items-center justify-center mb-6">
                <FaShippingFast className="text-accent-500 text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Entrega rápida</h3>
              <p className="text-gray-600">
                Servicio de entrega eficiente con seguimiento en tiempo real de tus pedidos.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <FaCheck className="text-accent-500 mr-2 flex-shrink-0" />
                  <span>Seguimiento en vivo</span>
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <FaCheck className="text-accent-500 mr-2 flex-shrink-0" />
                  <span>Notificaciones automáticas</span>
                </li>
              </ul>
            </div>
            
            {/* Beneficio 4 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 rounded-full bg-primary-500/10 flex items-center justify-center mb-6">
                <FaCreditCard className="text-primary-500 text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Pago seguro</h3>
              <p className="text-gray-600">
                Múltiples opciones de pago con la máxima seguridad para tus transacciones.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <FaCheck className="text-primary-500 mr-2 flex-shrink-0" />
                  <span>Encriptación avanzada</span>
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <FaCheck className="text-primary-500 mr-2 flex-shrink-0" />
                  <span>Verificación en dos pasos</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de productos destacados */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4">
                Catálogo
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Productos destacados</h2>
            </div>
            <Link
              to="/productos"
              className="group mt-4 md:mt-0 text-primary-600 font-medium flex items-center hover:text-primary-700 transition-colors"
            >
              Ver todos los productos 
              <FaArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="loading-spinner mb-4"></div>
              <p className="text-gray-500">Cargando productos destacados...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 p-8 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <FaExclamationTriangle className="text-danger-500 text-xl mr-3 flex-shrink-0" />
                <h3 className="text-xl font-semibold text-danger-700">{error}</h3>
              </div>
              
              {authRequired ? (
                <div className="flex flex-col space-y-4">
                  <p className="text-gray-700 mb-6">
                    Para acceder a los productos, necesitas iniciar sesión en la plataforma. 
                    El backend requiere autenticación para acceder a esta información.
                  </p>
                  <div>
                    <Link to="/login" className="btn btn-primary btn-lg">
                      Iniciar sesión
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col space-y-4">
                  <p className="text-gray-700 mb-6">
                    Hubo un problema al cargar los productos desde el servidor. 
                    Por favor, verifica tu conexión o intenta de nuevo más tarde.
                  </p>
                  <div>
                    <button onClick={handleRetry} className="btn btn-primary">
                      Intentar de nuevo
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} producto={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Sección de testimonios */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-secondary-100 text-secondary-700 text-sm font-medium mb-4">
              Testimonios
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-lg text-gray-600">
              Miles de empresas y clientes confían en nosotros para gestionar sus productos y pedidos.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map(testimonial => (
              <div key={testimonial.id} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all">
                {/* Estrellas */}
                <div className="flex mb-6">
                  {[...Array(5)].map((_, i) => (
                    <FaStar 
                      key={i} 
                      className={i < testimonial.rating ? "text-amber-400" : "text-gray-300"} 
                      size={18} 
                    />
                  ))}
                </div>
                
                {/* Testimonio */}
                <p className="text-gray-700 mb-6 italic">"{testimonial.comment}"</p>
                
                {/* Usuario */}
                <div className="flex items-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 