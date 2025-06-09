import { createContext, useContext, useState, useEffect } from 'react';

// Crear el contexto
const CartContext = createContext();

// Proveedor del contexto
export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  // Cargar carrito del localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      setCart(parsedCart);
    }
  }, []);

  // Actualizar localStorage cuando cambia el carrito
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Calcular el total
    const newTotal = cart.reduce(
      (sum, item) => sum + item.precio * item.cantidad,
      0
    );
    setTotal(newTotal);
  }, [cart]);

  // Añadir producto al carrito
  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      // Verificar si el producto ya está en el carrito
      const existingItemIndex = prevCart.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Actualizar cantidad si ya existe
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          cantidad: updatedCart[existingItemIndex].cantidad + quantity
        };
        return updatedCart;
      } else {
        // Añadir nuevo producto al carrito
        return [...prevCart, { ...product, cantidad: quantity }];
      }
    });
  };

  // Actualizar cantidad de un producto en el carrito
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === productId ? { ...item, cantidad: quantity } : item
      )
    );
  };

  // Eliminar producto del carrito
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  // Vaciar el carrito
  const clearCart = () => {
    setCart([]);
  };

  // Valor del contexto
  const value = {
    cart,
    total,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    itemCount: cart.reduce((sum, item) => sum + item.cantidad, 0)
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Hook personalizado para usar el contexto
export function useCart() {
  return useContext(CartContext);
}

export default CartContext; 