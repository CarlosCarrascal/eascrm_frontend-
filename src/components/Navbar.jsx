import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { 
  FaShoppingCart, 
  FaUser, 
  FaSignOutAlt, 
  FaSignInAlt, 
  FaBars, 
  FaTimes, 
  FaBox, 
  FaHome, 
  FaClipboardList,
  FaChevronDown
} from 'react-icons/fa';

export default function Navbar() {
  const { isAuthenticated, logout, currentUser } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Detectar scroll para cambiar el estilo del navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setUserMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  // Determinar si una ruta está activa
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Clase para enlaces activos
  const activeLinkClass = "text-white font-medium";
  const inactiveLinkClass = "text-white/80 hover:text-white";

  // Obtener el correo del usuario
  const userEmail = currentUser?.email || 'usuario@ejemplo.com';

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-primary-700 shadow-lg' 
        : 'bg-primary-700/90 backdrop-blur-sm'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold flex items-center text-white">
            <span className="bg-white text-primary-600 px-2 py-1 rounded-lg mr-2">E</span>
            <span className="hidden sm:inline">EasyCRM</span>
          </Link>

          {/* Botón del menú móvil */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-white focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full p-2 hover:bg-primary-700/30 transition-colors"
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>

          {/* Menú de navegación para pantallas medianas y grandes */}
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') ? activeLinkClass : inactiveLinkClass
              }`}
            >
              <span className="flex items-center">
                <FaHome className="mr-1.5" size={14} />
                Inicio
              </span>
            </Link>
            
            <Link 
              to="/productos" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/productos') ? activeLinkClass : inactiveLinkClass
              }`}
            >
              <span className="flex items-center">
                <FaBox className="mr-1.5" size={14} />
                Productos
              </span>
            </Link>
            
            {/* Enlaces solo para usuarios autenticados */}
            {isAuthenticated && (
              <Link 
                to="/pedidos" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/pedidos') ? activeLinkClass : inactiveLinkClass
                }`}
              >
                <span className="flex items-center">
                  <FaClipboardList className="mr-1.5" size={14} />
                  Mis Pedidos
                </span>
              </Link>
            )}
            
            {/* Carrito */}
            <Link 
              to="/carrito" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
                isActive('/carrito') ? activeLinkClass : inactiveLinkClass
              }`}
            >
              <span className="flex items-center">
                <FaShoppingCart className="mr-1.5" size={14} />
                Carrito
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-secondary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </span>
            </Link>
          </div>

          {/* Usuario - versión desktop */}
          <div className="hidden md:block">
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={toggleUserMenu}
                  className="flex items-center text-white hover:text-white/90 transition-colors bg-primary-700/30 hover:bg-primary-700/50 rounded-full pl-3 pr-2 py-1.5 text-sm"
                  aria-expanded={userMenuOpen}
                >
                  <span className="flex items-center">
                    <FaUser className="mr-1.5" size={14} />
                    Mi Cuenta
                    <FaChevronDown className={`ml-1 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} size={10} />
                  </span>
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-10 border border-gray-200 transform origin-top-right transition-all duration-150">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm text-gray-500">Conectado como</p>
                      <p className="text-sm font-medium text-gray-800 truncate">{userEmail}</p>
                    </div>
                    <Link
                      to="/perfil"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Mi Perfil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <FaSignOutAlt className="inline mr-2" size={12} />
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center bg-white text-primary-600 hover:bg-gray-100 px-4 py-1.5 rounded-md text-sm font-medium transition-colors shadow-sm"
              >
                <FaSignInAlt className="mr-1.5" size={14} />
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>

        {/* Menú móvil - slide down animation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 space-y-1 border-t border-primary-400/30 animate-slideDown overflow-hidden">
            <Link 
              to="/" 
              className={`block py-2 px-3 rounded-md ${
                isActive('/') 
                  ? 'bg-primary-700/30 text-white' 
                  : 'text-white/90 hover:bg-primary-700/20 hover:text-white'
              } transition-colors`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="flex items-center">
                <FaHome className="mr-2" size={16} />
                Inicio
              </span>
            </Link>
            
            <Link 
              to="/productos" 
              className={`block py-2 px-3 rounded-md ${
                isActive('/productos') 
                  ? 'bg-primary-700/30 text-white' 
                  : 'text-white/90 hover:bg-primary-700/20 hover:text-white'
              } transition-colors`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="flex items-center">
                <FaBox className="mr-2" size={16} />
                Productos
              </span>
            </Link>
            
            {/* Enlaces solo para usuarios autenticados */}
            {isAuthenticated && (
              <Link 
                to="/pedidos" 
                className={`block py-2 px-3 rounded-md ${
                  isActive('/pedidos') 
                    ? 'bg-primary-700/30 text-white' 
                    : 'text-white/90 hover:bg-primary-700/20 hover:text-white'
                } transition-colors`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="flex items-center">
                  <FaClipboardList className="mr-2" size={16} />
                  Mis Pedidos
                </span>
              </Link>
            )}
            
            {/* Carrito siempre visible pero requiere autenticación para acciones */}
            <Link 
              to="/carrito" 
              className={`block py-2 px-3 rounded-md ${
                isActive('/carrito') 
                  ? 'bg-primary-700/30 text-white' 
                  : 'text-white/90 hover:bg-primary-700/20 hover:text-white'
              } transition-colors`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="flex items-center">
                <FaShoppingCart className="mr-2" size={16} />
                Carrito {itemCount > 0 && `(${itemCount})`}
              </span>
            </Link>
            
            {/* Opciones de usuario en móvil */}
            {isAuthenticated ? (
              <>
                <Link 
                  to="/perfil" 
                  className={`block py-2 px-3 rounded-md ${
                    isActive('/perfil') 
                      ? 'bg-primary-700/30 text-white' 
                      : 'text-white/90 hover:bg-primary-700/20 hover:text-white'
                  } transition-colors`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="flex items-center">
                    <FaUser className="mr-2" size={16} />
                    Mi Perfil
                  </span>
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="w-full text-left py-2 px-3 rounded-md text-white/90 hover:bg-primary-700/20 hover:text-white transition-colors flex items-center"
                >
                  <FaSignOutAlt className="mr-2" size={16} />
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block py-2 px-3 rounded-md bg-white text-primary-600 hover:bg-gray-100 transition-colors flex items-center shadow-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaSignInAlt className="mr-2" size={16} />
                Iniciar Sesión
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
} 