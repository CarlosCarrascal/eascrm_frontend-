import { useState, useEffect } from 'react';

const ImageWithFallback = ({ src, alt, className, fallbackText = 'Sin imagen', fallback = null }) => {
  const [error, setError] = useState(false);
  const [imgSrc, setImgSrc] = useState('');
  
  useEffect(() => {
    // Verificar si la URL es válida
    if (!src) {
      setError(true);
      return;
    }
    
    // Resetear el error cuando cambia la fuente
    setError(false);
    
    // Si la URL no comienza con http o https, asumimos que es una ruta relativa
    // y la convertimos en absoluta agregando la URL base de la API
    if (src && !src.startsWith('http://') && !src.startsWith('https://')) {
      // Si la URL no comienza con /, añadirlo
      const normalizedSrc = src.startsWith('/') ? src : `/${src}`;
      setImgSrc(`http://localhost:8000${normalizedSrc}`);
      console.log("URL de imagen convertida:", `http://localhost:8000${normalizedSrc}`);
    } else {
      setImgSrc(src);
      console.log("URL de imagen original:", src);
    }
  }, [src]);

  const handleError = () => {
    console.log("Error cargando imagen:", imgSrc);
    setError(true);
  };

  if (error || !imgSrc) {
    if (fallback) {
      return fallback;
    }
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <span className="text-gray-500 text-xs text-center">{fallbackText}</span>
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
};

export default ImageWithFallback; 