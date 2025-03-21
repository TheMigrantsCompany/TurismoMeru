import React, { useState, useContext } from "react";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";
import Checkout from "../../components/checkout/CheckOut";
import { motion } from "framer-motion";
import { AuthContext } from "../../firebase/AuthContext";

const ShoppingCart = () => {
  const { cartItems, removeFromCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const navigate = useNavigate();
  const { setAllowHomeNavigation } = useContext(AuthContext);
  
  const subtotal = cartItems.reduce((acc, item) => {
  const price = parseFloat(item.price); // Convertir precio a número
  const discountForMinors = item.discountForMinors || 0;
  const discountForSeniors = item.discountForSeniors || 0;
  const quantities = item.quantities || {};

  // Cálculos para cada grupo
  const adultsTotal = price * (quantities.adults || 0);
  const minorsTotal = quantities.children > 0 
    ? (price * (1 - discountForMinors / 100)) * quantities.children
    : 0; // Solo aplicar descuento si hay menores
  const seniorsTotal = quantities.seniors > 0 
    ? (price * (1 - discountForSeniors / 100)) * quantities.seniors
    : 0; // Solo aplicar descuento si hay jubilados

  return acc + adultsTotal + minorsTotal + seniorsTotal;
}, 0);


  const total = subtotal;

  const handlePurchaseSuccess = () => {
    setShowCheckout(false);
    navigate('/orderform');
  };

 const handleGoToExcursions = () => {
  setAllowHomeNavigation(true); 
  navigate("/");
};

  return (
    <div className="min-h-screen bg-[#dac9aa]/20 py-12">
      <div className="container mx-auto px-8 max-w-[1600px]">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-8 text-[#4256a6] font-poppins text-center"
        >
          Carrito de Compra
        </motion.h1>
        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="bg-[#f9f3e1] rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold text-[#4256a6] font-poppins mb-4">
                Tu carrito está vacío
              </h2>
              <p className="text-[#425a66] mb-6">
                ¡Explora nuestras excursiones y vive una experiencia única!
              </p>
              <button
                onClick={handleGoToExcursions}
                className="bg-[#4256a6] text-white px-8 py-3 rounded-lg hover:bg-[#2a3875] transition-all duration-300 font-poppins shadow-md hover:shadow-lg"
              >
                Ver Excursiones
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-6">
              {cartItems.map((item, index) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={`cart-item-${item.id_Service}-${index}`}
                  className="bg-[#f9f3e1] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-start space-x-4">
                      <img
                        src={ item.photos && item.photos.length > 0 ? item.photos[0] : "https://via.placeholder.com/80" }
                        alt={item.title}
                        className="w-24 h-24 object-cover rounded-lg shadow-md"
                      />
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-[#4256a6] font-poppins mb-1">
                          {item.title}
                        </h3>
                        <p className="text-[#425a66] text-sm">
                          Duración: {item.duration || "No disponible"} horas
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#dac9aa]/20 p-4 rounded-lg">
                      <div className="space-y-2">
                        <p className="text-[#425a66]">
                          <span className="font-medium">Adultos:</span> {item.quantities?.adults || 0}
                        </p>
                        <p className="text-[#425a66]">
                          <span className="font-medium">Niños:</span> {item.quantities?.children || 0}
                        </p>
                        <p className="text-[#425a66]">
                          <span className="font-medium">Jubilados:</span> {item.quantities?.seniors || 0}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[#425a66]">
                          <span className="font-medium">Fecha:</span> {item.selectedDate || "No seleccionada"}
                        </p>
                        <p className="text-[#425a66]">
                          <span className="font-medium">Hora:</span> {item.selectedTime || "No seleccionada"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-[#425a66]/10">
                      <p className="text-xl font-semibold text-[#4256a6]">
                        ${item.price || "No disponible"} <span className="text-sm">(Precio Unitario)</span>
                       </p>
                      <button
                        onClick={() => removeFromCart(item.id_Service)}
                        className="text-red-500 hover:text-red-700 transition-colors duration-300 flex items-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Eliminar
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="lg:w-1/3">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-[#f9f3e1] rounded-xl shadow-lg sticky top-8"
              >
                <div className="p-6 space-y-6">
                  <h2 className="text-2xl font-semibold text-[#4256a6] font-poppins border-b border-[#425a66]/10 pb-4">
                    Resumen del pedido
                  </h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-[#dac9aa]/20 p-4 rounded-lg">
                      <span className="text-[#425a66] font-medium">Subtotal</span>
                      <span className="text-[#4256a6] font-semibold">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center bg-[#dac9aa]/20 p-4 rounded-lg">
                      <span className="text-[#425a66] font-medium">Total</span>
                      <span className="text-xl font-bold text-[#4256a6]">${total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-4">
                    <button
                      className="w-full bg-[#4256a6] text-white py-3 rounded-lg hover:bg-[#2a3875] transition-all duration-300 font-poppins shadow-md hover:shadow-lg"
                      onClick={() => setShowCheckout(true)}
                    >
                      Finalizar Compra
                    </button>
                    <button
                      className="w-full bg-[#dac9aa] text-[#4256a6] py-3 rounded-lg hover:bg-[#e1d4b0] transition-all duration-300 font-poppins shadow-md hover:shadow-lg"
                      onClick={handleGoToExcursions}
                     >
                       Seguir Comprando
                    </button>
                  </div>
                </div>
              </motion.div>
              {showCheckout && (
                <Checkout total={total} onPurchaseSuccess={handlePurchaseSuccess} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;
