import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export default function Layout() {
  const location = useLocation();

  // Efecto para hacer scroll hacia arriba cuando cambia la ruta
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Fondo decorativo superior */}
      <div className="absolute top-0 w-full h-48 bg-gradient-to-r from-primary-700 to-primary-500 -z-10" />
      
      {/* Contenido principal */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow max-w-screen-2xl w-full mx-auto">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
} 