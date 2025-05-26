import { createContext, useContext, useState, useCallback, useMemo } from 'react';

// Crear el contexto
const CartContext = createContext();

// Componente Provider como exportación por defecto
const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Función para agregar un producto al carrito
  const addToCart = useCallback((product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => 
        item.id === product.id && item.size === product.size
      );
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id && item.size === product.size
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
      }
      
      return [...prevItems, { 
        ...product,
        price: product.precio ?? product.price, // <- esta línea estandariza
        quantity: product.quantity || 1 
      }];
    });
  }, []);

  const parsePrice = (price) => {
  if (typeof price === 'number') return price;
  if (typeof price === 'string') {
    const cleaned = price.replace(/[^0-9.,]/g, '').replace(',', '.');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

  // Función para eliminar un producto del carrito
const removeFromCart = useCallback((id, size = null) => {
  setCartItems(prevItems => 
    prevItems.filter(item => 
      !(item.id === id && (size ? item.size === size : true))
    )
  );
}, []);


  // Calcular el total del carrito
const getTotal = useCallback(() => {
  return cartItems.reduce((total, item) => {
    const price = parsePrice(item.price);
    const quantity = Number(item.quantity) || 1;
    return total + (price * quantity);
  }, 0);
}, [cartItems]);



  // Memoizar el valor del contexto para optimización
  const contextValue = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    getTotal
  }), [cartItems, addToCart, removeFromCart, getTotal]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// Hook personalizado como exportación nombrada
const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
};

// Exportaciones
export default CartProvider;
export { useCart };