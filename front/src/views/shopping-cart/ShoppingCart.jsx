import React, { useState } from 'react';
import { useCart } from './CartContext';
import Checkout from '../../components/checkout/CheckOut';

const ShoppingCart = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart(); 
  const [showCheckout, setShowCheckout] = useState(false); 

  // Cálculo del total del carrito
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.price ? Number(item.price) : 0) * item.quantity,
    0
  );

  const shipping = 5; 
  const taxes = subtotal * 0.1; 
  const total = subtotal + shipping + taxes;

  return (
    <div className="container mx-auto p-6 mt-16">
      <h1 className="text-3xl font-bold mb-6 text-black">Carrito de Compra</h1>
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="w-full md:w-2/3 space-y-6">
          {cartItems.map((item, index) => (
            <div key={`cart-item-${item.id}-${index}`} className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-4">
              <img
  src={item.photos && item.photos.length > 0 ? item.photos[0] : 'https://via.placeholder.com/80'} 
  alt={item.title} 
  className="w-20 h-20 object-cover"
/>
                <div>
                  <h3 className="text-lg font-semibold text-black">{item.title}</h3>
                  <p className="text-sm text-black">{item.color}</p>
                  <p className="text-sm text-black">{item.size}</p>
                  <p className="text-sm font-bold text-black">
  ${(item.price && typeof item.price === 'number' ? item.price : 0).toFixed(2)}
</p>
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
                  onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5].map((quantity) => (
                    <option key={`quantity-${item.id}-${quantity}`} value={quantity}>
                      {quantity}
                    </option>
                  ))}
                </select>
                <button 
                  className="ml-4 text-gray-500 hover:text-red-500"
                  onClick={() => removeFromCart(item.id)}
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Contenedor para el Resumen del pedido y Checkout */}
        <div className="w-full md:w-1/3 space-y-6">
          <div className="p-6 bg-gray-50 rounded-lg shadow-lg">
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
              <span>${total.toFixed(2)}</span>
            </div>
            <button 
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              onClick={() => setShowCheckout(true)} // Mostrar el Checkout al hacer clic
            >
              Verificar
            </button>
          </div>

          {/* Muestra el componente Checkout al hacer clic en "Verificar" */}
          {showCheckout && (
            <div className="p-6 bg-gray-50 rounded-lg shadow-lg">
              <Checkout total={total} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
