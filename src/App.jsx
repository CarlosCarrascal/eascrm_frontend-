import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProductosPage from './pages/ProductosPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LinkClientPage from './pages/LinkClientPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="productos" element={<ProductosPage />} />
              <Route path="productos/:id" element={<ProductDetailPage />} />
              <Route
                path="carrito"
                element={<ProtectedRoute><CartPage /></ProtectedRoute>}
              />
              <Route
                path="pedidos"
                element={<ProtectedRoute><OrdersPage /></ProtectedRoute>}
              />
              <Route
                path="pedidos/:id"
                element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>}
              />
              <Route
                path="perfil"
                element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
              />
            </Route>
            <Route path="login" element={<LoginPage />} />
            <Route path="registro" element={<RegisterPage />} />
            <Route path="vincular-cliente" element={<LinkClientPage />} />
            <Route
              path="*"
              element={
                <div className="container mx-auto p-8 text-center">
                  <h1 className="text-3xl font-bold mb-4">Página no encontrada</h1>
                  <p className="mb-4">La página que estás buscando no existe.</p>
                  <a href="/" className="btn btn-primary">Volver al inicio</a>
                </div>
              }
            />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
