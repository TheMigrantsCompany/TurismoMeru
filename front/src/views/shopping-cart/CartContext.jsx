import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    setCartItems((prev) => {
      const existingItem = prev.find((cartItem) => cartItem.id_Service === item.id_Service);
      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.id_Service === item.id_Service
            ? {
                ...cartItem,
                quantities: {
                  adultos: cartItem.quantities.adultos + item.quantities.adultos,
                  menores: cartItem.quantities.menores + item.quantities.menores,
                  jubilados: cartItem.quantities.jubilados + item.quantities.jubilados,
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
    setCartItems((prev) => prev.filter((item) => item.id_Service !== id_Service));
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, updateQuantity, removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
