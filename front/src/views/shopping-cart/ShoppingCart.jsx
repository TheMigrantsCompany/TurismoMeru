import React, { useState } from 'react';

const ShoppingCart = () => {
 
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Camiseta básica', color: 'Tierra de siena', size: 'Grande', price: 32, quantity: 1, stock: true },
    { id: 2, name: 'Camiseta básica', color: 'Negro', size: 'Grande', price: 32, quantity: 1, stock: false },
  ]);

  // Función para actualizar la cantidad de un producto
  const updateQuantity = (id, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: parseInt(quantity) } : item
      )
    );
  };

  // Cálculo del total del carrito
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const shipping = 5; // Estimación de envío fija
  const taxes = subtotal * 0.1; // Suponiendo un 10% de impuestos
  const total = subtotal + shipping + taxes;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-black">Carro de la compra</h1>
      <div className="flex flex-col md:flex-row justify-between gap-6">
        {/* Columna izquierda: Lista de productos */}
        <div className="w-full md:w-2/3 space-y-6">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-4">
                <img
                  src={`https://via.placeholder.com/80`}
                  alt={item.name}
                  className="w-20 h-20 object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-black">{item.name}</h3>
                  <p className="text-sm text-black">{item.color}</p>
                  <p className="text-sm text-black">{item.size}</p>
                  <p className="text-sm font-bold text-black">${item.price.toFixed(2)}</p>
                  {item.stock ? (
                    <p className="text-green-500 text-sm">En stock</p>
                  ) : (
                    <p className="text-gray-500 text-sm">Envío en 3-4 semanas</p>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <select
                  className="border border-gray-300 rounded-lg p-2"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, e.target.value)}
                >
                  {[1, 2, 3, 4, 5].map((quantity) => (
                    <option key={quantity} value={quantity}>
                      {quantity}
                    </option>
                  ))}
                </select>
                <button className="ml-4 text-gray-500 hover:text-red-500">×</button>
              </div>
            </div>
          ))}
        </div>

        {/* Columna derecha: Resumen del pedido */}
        <div className="w-full md:w-1/3 p-6 bg-gray-50 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-black">Resumen del pedido</h2>
          <div className="flex justify-between mb-2 text-black">
            <span>Total parcial:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2 text-black">
            <span>Estimación de envío:</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-4 text-black">
            <span>Estimación de impuestos:</span>
            <span>${taxes.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg mb-4 text-black">
            <span>Total del pedido:</span>
            <span>{total.toFixed(2)} dólares</span>
          </div>
          <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            Verificar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;