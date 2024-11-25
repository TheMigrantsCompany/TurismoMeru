import React, { useState } from "react";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";
import Checkout from "../../components/checkout/CheckOut";

const ShoppingCart = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const navigate = useNavigate();
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (typeof item.totalPrice === "number" ? item.totalPrice : 0),
    0
  );

  const total = subtotal;

  return (
    <div className="container mx-auto p-6 mt-16">
      <h1 className="text-3xl font-bold mb-6 text-black">Carrito de Compra</h1>
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="w-full md:w-2/3 space-y-6">
          {cartItems.map((item, index) => (
            <div
              key={`cart-item-${item.id_Service}-${index}`}
              className="flex flex-col space-y-4 p-4 border-b bg-gray-50 rounded-lg shadow"
            >
              {/* Imagen y título */}
              <div className="flex items-center space-x-4">
                <img
                  src={
                    item.photos && item.photos.length > 0
                      ? item.photos[0]
                      : "https://via.placeholder.com/80"
                  }
                  alt={item.title}
                  className="w-20 h-20 object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-black">{item.title}</h3>
                  <p className="text-gray-600 text-sm">
                    Duración: {item.duration || "No disponible"} horas
                  </p>
                </div>
              </div>

              {/* Detalles de la excursión */}
              <div className="text-sm text-gray-700">
                <p>
                  <strong>Adultos:</strong> {item.quantities?.adults || 0}
                </p>
                <p>
                  <strong>Niños:</strong> {item.quantities?.children || 0}
                </p>
                <p>
                  <strong>Jubilados:</strong> {item.quantities?.seniors || 0}
                </p>
                {/* Fecha y hora seleccionada */}
                <p>
                  <strong>Fecha:</strong> {item.selectedDate || "No seleccionada"}
                </p>
                <p>
                  <strong>Hora:</strong> {item.selectedTime || "No seleccionada"}
                </p>
              </div>

              {/* Precio, cantidad y opción eliminar */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-black">
                    Precio base: ${item.price || "No disponible"}
                  </p>
                  <p
                    className="text-sm text-red-500 underline cursor-pointer hover:text-red-700 transition"
                    onClick={() => removeFromCart(item.id_Service)} // Eliminar el artículo del carrito usando id_Service
                  >
                    Eliminar
                  </p>
                </div>
                
              </div>
            </div>
          ))}
        </div>

        {/* Resumen del pedido */}
        <div className="w-full md:w-1/3 space-y-6">
          <div className="p-6 bg-gray-50 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-black">
              Resumen del pedido
            </h2>
            <div className="flex justify-between font-semibold text-lg mb-4 text-black">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-300 my-4"></div>
            <div className="flex justify-between font-semibold text-lg text-black">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              onClick={() => setShowCheckout(true)}
            >
              Finalizar Compra
            </button>
            <button
              className="w-full bg-gray-200 text-black py-2 rounded-lg hover:bg-gray-300 transition-colors mt-4"
              onClick={() => navigate("/")}
            >
              Seguir Comprando
            </button>
          </div>
          {showCheckout && <Checkout total={total} />}
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
