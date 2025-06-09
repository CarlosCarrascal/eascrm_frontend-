import { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaSortAmountDown, FaSortAmountUp, FaExclamationTriangle } from 'react-icons/fa';
import { productoService } from '../services/api';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function MenuPage() {
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
        
        console.log('Solicitando productos con parámetros:', params);
        const response = await productoService.getAll(params);
        console.log('Respuesta de productos:', response);
        
        if (response && response.results) {
          setProducts(response.results || []);
          
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
        
        if (err.response && err.response.status === 401 && !isAuthenticated) {
          setError("Se requiere autenticación para ver los productos");
          setAuthRequired(true);
        } else {
          setError("No se pudieron cargar los productos. Por favor, intenta de nuevo.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, search, sortBy, sortDirection, filters, isAuthenticated, retryCount]);

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
    }
  };

  // Reintentar cargar productos
  const handleRetry = () => {
    setRetryCount(retryCount + 1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Nuestro Menú</h1>
      
      {/* Filtros y búsqueda */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          {/* Búsqueda */}
          <form onSubmit={handleSearch} className="flex-grow">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar productos..."
                className="input pr-10"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary"
              >
                <FaSearch />
              </button>
            </div>
          </form>
          
          {/* Botón de filtros para móvil */}
          <div className="md:hidden">
            <button
              onClick={() => document.getElementById('filterPanel').classList.toggle('hidden')}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200 w-full flex items-center justify-center px-4 py-2 rounded-md"
            >
              <FaFilter className="mr-2" />
              Filtros
            </button>
          </div>
          
          {/* Ordenamiento */}
          <div className="flex items-center">
            <span className="text-gray-700 mr-2">Ordenar por:</span>
            <select
              value={`${sortBy}-${sortDirection}`}
              onChange={(e) => {
                const [field, direction] = e.target.value.split('-');
                setSortBy(field);
                setSortDirection(direction);
              }}
              className="select w-auto"
            >
              <option value="nombre-asc">Nombre (A-Z)</option>
              <option value="nombre-desc">Nombre (Z-A)</option>
              <option value="precio-asc">Precio (menor a mayor)</option>
              <option value="precio-desc">Precio (mayor a menor)</option>
              <option value="stock-desc">Disponibilidad</option>
            </select>
          </div>
        </div>
        
        {/* Panel de filtros (colapsable en móvil) */}
        <div id="filterPanel" className="mt-4 hidden md:block">
          <h3 className="font-semibold text-lg mb-2">Filtros</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Precio mínimo */}
            <div>
              <label htmlFor="minPrice" className="block text-gray-700 mb-1">
                Precio mínimo
              </label>
              <input
                type="number"
                id="minPrice"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="Mínimo"
                min="0"
                className="input"
              />
            </div>
            
            {/* Precio máximo */}
            <div>
              <label htmlFor="maxPrice" className="block text-gray-700 mb-1">
                Precio máximo
              </label>
              <input
                type="number"
                id="maxPrice"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="Máximo"
                min="0"
                className="input"
              />
            </div>
            
            {/* Disponibilidad */}
            <div className="flex items-center mt-6">
              <input
                type="checkbox"
                id="inStock"
                name="inStock"
                checked={filters.inStock}
                onChange={handleFilterChange}
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label htmlFor="inStock" className="ml-2 block text-gray-700">
                Solo productos en stock
              </label>
            </div>
          </div>
        </div>
      </div>
      
      {/* Lista de productos */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <FaExclamationTriangle className="text-danger text-xl mr-2" />
            <h3 className="text-lg font-semibold text-danger">{error}</h3>
          </div>
          
          {authRequired ? (
            <div className="flex flex-col space-y-4">
              <p className="text-gray-700">
                Para acceder a los productos, necesitas iniciar sesión en la plataforma. 
                El backend requiere autenticación para acceder a esta información.
              </p>
              <div className="flex space-x-4">
                <Link to="/login" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600">
                  Iniciar sesión
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              <p className="text-gray-700">
                Hubo un problema al cargar los productos desde el servidor. 
                Por favor, verifica tu conexión o intenta de nuevo más tarde.
              </p>
              <div>
                <button onClick={handleRetry} className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600">
                  Intentar de nuevo
                </button>
              </div>
            </div>
          )}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No se encontraron productos</h3>
          <p className="text-gray-600">
            Intenta con otros criterios de búsqueda o filtros.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} producto={product} />
          ))}
        </div>
      )}
      
      {/* Paginación */}
      {!loading && !error && products.length > 0 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-white border border-gray-300 rounded-l-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            
            {/* Números de página */}
            <div className="flex">
              {[...Array(totalPages).keys()].map((page) => {
                const pageNumber = page + 1;
                // Mostrar solo algunas páginas para no sobrecargar la UI
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`px-3 py-1 border border-gray-300 ${
                        pageNumber === currentPage
                          ? 'bg-primary text-white'
                          : 'bg-white hover:bg-gray-100'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                }
                
                // Mostrar puntos suspensivos
                if (
                  (pageNumber === currentPage - 2 && pageNumber > 2) ||
                  (pageNumber === currentPage + 2 && pageNumber < totalPages - 1)
                ) {
                  return <span key={pageNumber} className="px-3 py-1 border border-gray-300 bg-white">...</span>;
                }
                
                return null;
              })}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-white border border-gray-300 rounded-r-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </nav>
        </div>
      )}
    </div>
  );
} 