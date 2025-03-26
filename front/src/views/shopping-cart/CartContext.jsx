import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("uuid");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      setCartItems([]);
    }
  }, []);


  const getCartKey = () => {
    return userId ? `cartItems_${userId}` : null;
  };

  useEffect(() => {
    if (userId) {
      const key = getCartKey();
      const storedCart = localStorage.getItem(key);
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } else {
    
      setCartItems([]);
    }
  }, [userId]);

  // Guardar el carrito en localStorage solo si el usuario está logueado
  useEffect(() => {
    if (userId) {
      const key = getCartKey();
      localStorage.setItem(key, JSON.stringify(cartItems));
    }
  }, [cartItems, userId]);

  const addToCart = (item) => {
    setCartItems((prev) => {
      const existingItem = prev.find(
        (cartItem) => cartItem.id_Service === item.id_Service
      );
      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.id_Service === item.id_Service
            ? {
                ...cartItem,
                quantities: {
                  adults: cartItem.quantities.adults + item.quantities.adults,
                  children:
                    cartItem.quantities.children + item.quantities.children,
                  seniors:
                    cartItem.quantities.seniors + item.quantities.seniors,
                  babies: cartItem.quantities.babies + item.quantities.babies,
                },
                totalPrice: cartItem.totalPrice + item.totalPrice,
              }
            : cartItem
        );
      }
      return [...prev, { ...item }];
    });
  };

  const updateQuantity = (id_Service, quantity) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id_Service === id_Service ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (id_Service) => {
    setCartItems((prev) =>
      prev.filter((item) => item.id_Service !== id_Service)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        setUserId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
