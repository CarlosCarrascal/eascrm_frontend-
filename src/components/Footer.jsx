import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-800 text-white pt-10 pb-5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Columna 1: Información de contacto */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Contáctanos</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-300">
                <FaPhone className="mr-2 text-primary-400" />
                <span>+56 9 1234 5678</span>
              </li>
              <li className="flex items-center text-gray-300">
                <FaEnvelope className="mr-2 text-primary-400" />
                <span>contacto@easycrm.com</span>
              </li>
              <li className="flex items-center text-gray-300">
                <FaMapMarkerAlt className="mr-2 text-primary-400" />
                <span>Av. Siempre Viva 123, Santiago</span>
              </li>
            </ul>
          </div>

          {/* Columna 2: Enlaces útiles */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Enlaces</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/productos" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Productos
                </Link>
              </li>
              <li>
                <Link to="/pedidos" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Mis Pedidos
                </Link>
              </li>
              <li>
                <Link to="/perfil" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Mi Perfil
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Redes sociales */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Síguenos</h3>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-primary-400 transition-colors"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-primary-400 transition-colors"
              >
                <FaTwitter size={24} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-primary-400 transition-colors"
              >
                <FaInstagram size={24} />
              </a>
            </div>
            <div className="mt-4">
              <p className="text-gray-300">Suscríbete a nuestro boletín para recibir ofertas exclusivas.</p>
              <div className="mt-2 flex">
                <input
                  type="email"
                  placeholder="Tu correo electrónico"
                  className="px-3 py-2 text-gray-700 bg-white rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                <button className="bg-primary-500 px-4 py-2 rounded-r-md hover:bg-primary-600 text-white">
                  Suscribir
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Derechos de autor */}
        <div className="mt-8 pt-6 border-t border-gray-700 text-center">
          <p className="text-gray-400">&copy; {currentYear} EasyCRM. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
} 