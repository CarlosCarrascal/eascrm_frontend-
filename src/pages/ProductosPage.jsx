import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaSearch, 
  FaFilter, 
  FaExclamationTriangle, 
  FaSortAmountDown, 
  FaSortAmountUp,
  FaTags,
  FaChevronDown,
  FaShoppingCart
} from 'react-icons/fa';
import { productoService } from '../services/api';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../contexts/AuthContext';

export default function ProductosPage() {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('nombre');
  const [sortDirection, setSortDirection] = useState('asc');
  const [authRequired, setAuthRequired] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  
  // Filtros
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    inStock: false,
  });
  
  // Cargar productos
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        setAuthRequired(false);
        
        // Preparar parámetros
        const params = {
          page: currentPage,
          search: search || undefined,
          ordering: `${sortDirection === 'desc' ? '-' : ''}${sortBy}`,
        };
        
        // Añadir filtros de precio si están definidos
        if (filters.minPrice) params.min_price = filters.minPrice;
        if (filters.maxPrice) params.max_price = filters.maxPrice;
        if (filters.inStock) params.stock__gt = 0;
        
        const response = await productoService.getAll(params);
        
        if (response && response.results) {
          setProducts(response.results || []);
          setTotalProducts(response.count || 0);
          
          // Calcular total de páginas
          const count = response.count || 0;
          const pageSize = 10; // Ajustar según la API
          setTotalPages(Math.ceil(count / pageSize));
        } else {
          // Si la respuesta no tiene el formato esperado
          setError("La respuesta del servidor no tiene el formato esperado");
        }
      } catch (err) {
        console.error("Error al cargar productos:", err);
        
        // Ya no necesitamos verificar si es error 401 ya que el endpoint es público ahora
        setError("No se pudieron cargar los productos. Por favor, intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, search, sortBy, sortDirection, filters, retryCount]);

  // Manejar cambio de filtros
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters({
      ...filters,
      [name]: type === 'checkbox' ? checked : value,
    });
    // Reiniciar a la primera página cuando cambian los filtros
    setCurrentPage(1);
  };

  // Manejar cambio de ordenamiento
  const handleSortChange = (field) => {
    if (sortBy === field) {
      // Si ya estamos ordenando por este campo, invertir dirección
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Nuevo campo, ordenar ascendente por defecto
      setSortBy(field);
      setSortDirection('asc');
    }
    // Reiniciar a la primera página cuando cambia el ordenamiento
    setCurrentPage(1);
  };

  // Manejar búsqueda
  const handleSearch = (e) => {
    e.preventDefault();
    // La búsqueda se maneja a través del estado 'search'
    // que ya está incluido en el efecto de carga
    setCurrentPage(1); // Reiniciar a la primera página
  };

  // Manejar cambio de página
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Hacer scroll hacia arriba
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Reintentar cargar productos
  const handleRetry = () => {
    setRetryCount(retryCount + 1);
  };

  // Toggle panel de filtros en móvil
  const toggleFilterPanel = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  // Limpiar filtros
  const clearFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      inStock: false,
    });
    setSearch('');
    setCurrentPage(1);
  };

  // Generar array de números de página
  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    // Ajustar para mostrar maxPagesToShow si es posible
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-2xl shadow-lg p-6 sm:p-10 mb-8 text-white relative overflow-hidden">
      
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute left-0 bottom-0 transform -translate-x-1/4 translate-y-1/4">
            <FaShoppingCart size={300} />
          </div>
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-white">Catálogo de Productos</h1>
          <p className="text-white/90 max-w-xl mb-6">
            Explora nuestra amplia selección de productos de alta calidad. Filtra por precio o disponibilidad para encontrar exactamente lo que necesitas.
          </p>
          
          {/* Formulario de búsqueda destacado */}
          <form onSubmit={handleSearch} className="relative max-w-2xl">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar productos..."
              className="w-full pl-4 pr-12 py-3 rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
              aria-label="Buscar productos"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white p-1 rounded-full transition-colors"
              aria-label="Buscar"
            >
              <FaSearch size={20} />
            </button>
          </form>
        </div>
      </div>
      
      {/* Contenido principal con filtros y productos */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Panel de filtros lateral (desktop) */}
        <div className="lg:w-1/4 space-y-6 order-2 lg:order-1">
          <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center">
                <FaFilter className="mr-2 text-primary-500" /> 
                Filtros
              </h2>
              <button 
                onClick={clearFilters}
                className="text-xs text-primary-600 hover:text-primary-700 underline"
                aria-label="Limpiar filtros"
              >
                Limpiar filtros
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Rango de precios */}
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Rango de precio</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="minPrice" className="sr-only">Precio mínimo</label>
                    <input
                      type="number"
                      id="minPrice"
                      name="minPrice"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      placeholder="Mínimo"
                      min="0"
                      className="input text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="maxPrice" className="sr-only">Precio máximo</label>
                    <input
                      type="number"
                      id="maxPrice"
                      name="maxPrice"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      placeholder="Máximo"
                      min="0"
                      className="input text-sm"
                    />
                  </div>
                </div>
              </div>
              
              {/* Stock */}
              <div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="inStock"
                    name="inStock"
                    checked={filters.inStock}
                    onChange={handleFilterChange}
                    className="h-4 w-4 text-primary-500 rounded border-gray-300 focus:ring-primary-500"
                  />
                  <label htmlFor="inStock" className="ml-2 text-sm text-gray-700">
                    Solo productos en stock
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contenido principal */}
        <div className="lg:w-3/4 order-1 lg:order-2">
          {/* Barra de filtros móvil */}
          <div className="lg:hidden mb-4">
            <button
              onClick={toggleFilterPanel}
              className="w-full bg-white border border-gray-200 text-gray-700 px-4 py-3 rounded-lg shadow-sm flex items-center justify-between"
              aria-expanded={isFilterOpen}
              aria-controls="mobileFilterPanel"
            >
              <span className="flex items-center">
                <FaFilter className="mr-2 text-primary-500" />
                Filtros
              </span>
              <FaChevronDown className={`transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Panel de filtros para móvil */}
            <div 
              id="mobileFilterPanel" 
              className={`mt-2 bg-white rounded-lg shadow-md p-4 border border-gray-100 ${isFilterOpen ? 'block animate-slideDown' : 'hidden'}`}
            >
              <div className="space-y-4">
                {/* Precio */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Rango de precio</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      name="minPrice"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      placeholder="Mínimo"
                      min="0"
                      className="input text-sm"
                    />
                    <input
                      type="number"
                      name="maxPrice"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      placeholder="Máximo"
                      min="0"
                      className="input text-sm"
                    />
                  </div>
                </div>
                
                {/* Stock */}
                <div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="inStockMobile"
                      name="inStock"
                      checked={filters.inStock}
                      onChange={handleFilterChange}
                      className="h-4 w-4 text-primary-500 rounded border-gray-300 focus:ring-primary-500"
                    />
                    <label htmlFor="inStockMobile" className="ml-2 text-sm text-gray-700">
                      Solo productos en stock
                    </label>
                  </div>
                </div>
                
                {/* Botones de acción */}
                <div className="flex justify-between pt-2">
                  <button 
                    onClick={clearFilters}
                    className="text-sm text-gray-500 hover:text-gray-800"
                  >
                    Limpiar filtros
                  </button>
                  <button 
                    onClick={toggleFilterPanel}
                    className="btn btn-primary btn-sm"
                  >
                    Aplicar filtros
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Barra superior con stats y ordenamiento */}
          <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-wrap items-center justify-between border border-gray-100">
            <div className="text-sm text-gray-600 mb-2 sm:mb-0">
              <strong>{totalProducts}</strong> productos encontrados
              {search && <span> para "<strong>{search}</strong>"</span>}
            </div>
            
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-2 hidden sm:inline">Ordenar por:</span>
              <select
                value={`${sortBy}-${sortDirection}`}
                onChange={(e) => {
                  const [field, direction] = e.target.value.split('-');
                  setSortBy(field);
                  setSortDirection(direction);
                }}
                className="select text-sm py-1.5 pr-8 pl-3 border border-gray-300 rounded-md bg-white"
                aria-label="Ordenar productos"
              >
                <option value="nombre-asc">Nombre (A-Z)</option>
                <option value="nombre-desc">Nombre (Z-A)</option>
                <option value="precio-asc">Precio (menor a mayor)</option>
                <option value="precio-desc">Precio (mayor a menor)</option>
                <option value="stock-desc">Disponibilidad</option>
              </select>
              
              <button
                onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                className="ml-2 p-1.5 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                aria-label={`Cambiar a orden ${sortDirection === 'asc' ? 'descendente' : 'ascendente'}`}
              >
                {sortDirection === 'asc' ? (
                  <FaSortAmountDown size={16} className="text-gray-600" />
                ) : (
                  <FaSortAmountUp size={16} className="text-gray-600" />
                )}
              </button>
            </div>
          </div>
          
          {/* Mensajes de error */}
          {error && (
            <div className="bg-red-50 border border-red-200 p-6 rounded-lg shadow-sm mb-6 flex items-start">
              <FaExclamationTriangle className="mt-1 mr-3 text-danger-500 flex-shrink-0" />
              <div>
                <p className="font-bold text-danger-700">Error</p>
                <p className="text-gray-700">{error}</p>
                <button onClick={handleRetry} className="mt-3 btn btn-primary btn-sm">
                  Intentar de nuevo
                </button>
              </div>
            </div>
          )}
          
          {/* Filtros activos */}
          {(filters.minPrice || filters.maxPrice || filters.inStock || search) && (
            <div className="bg-gray-50 p-3 rounded-lg mb-6 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-gray-600 flex items-center">
                <FaTags className="mr-1" />
                Filtros activos:
              </span>
              
              {search && (
                <span className="inline-flex items-center bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                  Búsqueda: {search}
                  <button 
                    onClick={() => setSearch('')}
                    className="ml-1 text-primary-500 hover:text-primary-700"
                    aria-label="Eliminar filtro de búsqueda"
                  >
                    &times;
                  </button>
                </span>
              )}
              
              {filters.minPrice && (
                <span className="inline-flex items-center bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                  Precio mín: ${filters.minPrice}
                  <button 
                    onClick={() => setFilters({...filters, minPrice: ''})}
                    className="ml-1 text-primary-500 hover:text-primary-700"
                    aria-label="Eliminar filtro de precio mínimo"
                  >
                    &times;
                  </button>
                </span>
              )}
              
              {filters.maxPrice && (
                <span className="inline-flex items-center bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                  Precio máx: ${filters.maxPrice}
                  <button 
                    onClick={() => setFilters({...filters, maxPrice: ''})}
                    className="ml-1 text-primary-500 hover:text-primary-700"
                    aria-label="Eliminar filtro de precio máximo"
                  >
                    &times;
                  </button>
                </span>
              )}
              
              {filters.inStock && (
                <span className="inline-flex items-center bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                  Solo en stock
                  <button 
                    onClick={() => setFilters({...filters, inStock: false})}
                    className="ml-1 text-primary-500 hover:text-primary-700"
                    aria-label="Eliminar filtro de stock"
                  >
                    &times;
                  </button>
                </span>
              )}
              
              <button 
                onClick={clearFilters}
                className="text-xs text-gray-600 hover:text-gray-800 ml-auto underline"
              >
                Limpiar todos
              </button>
            </div>
          )}
          
          {/* Lista de productos */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="loading-spinner mb-4"></div>
              <p className="text-gray-500">Cargando productos...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((producto) => (
                <ProductCard key={producto.id} producto={producto} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
              <FaSearch size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No se encontraron productos</h3>
              <p className="text-gray-500 mb-6">Intenta con otros términos de búsqueda o ajusta los filtros</p>
              <button 
                onClick={clearFilters}
                className="btn btn-primary"
              >
                Ver todos los productos
              </button>
            </div>
          )}
          
          {/* Paginación */}
          {totalPages > 1 && !loading && (
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center" aria-label="Paginación">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md mx-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                  aria-label="Página anterior"
                >
                  Anterior
                </button>
                
                {/* Primera página */}
                {getPageNumbers()[0] > 1 && (
                  <>
                    <button
                      onClick={() => handlePageChange(1)}
                      className="px-3 py-1 rounded-md mx-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                      aria-label="Primera página"
                    >
                      1
                    </button>
                    {getPageNumbers()[0] > 2 && (
                      <span className="mx-1 text-gray-500">...</span>
                    )}
                  </>
                )}
                
                {/* Páginas del medio */}
                {getPageNumbers().map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded-md mx-1 shadow-sm ${
                      currentPage === page
                        ? 'bg-primary-500 text-white border border-primary-500'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    } transition-colors`}
                    aria-label={`Página ${page}`}
                    aria-current={currentPage === page ? 'page' : undefined}
                  >
                    {page}
                  </button>
                ))}
                
                {/* Última página */}
                {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
                  <>
                    {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
                      <span className="mx-1 text-gray-500">...</span>
                    )}
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      className="px-3 py-1 rounded-md mx-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                      aria-label="Última página"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md mx-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                  aria-label="Página siguiente"
                >
                  Siguiente
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 