import React, { useState } from 'react';
import { motion } from "framer-motion";

const Checkout = ({ total, onPurchaseSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      // Aquí iría la lógica de procesamiento del pago
      
      // Simulamos un proceso de pago exitoso
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Llamamos a la función onPurchaseSuccess cuando la compra se complete
      if (onPurchaseSuccess) {
        onPurchaseSuccess();
      }
      
    } catch (error) {
      console.error('Error durante el checkout:', error);
      alert('Hubo un error al procesar tu compra. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#f9f3e1] rounded-xl shadow-lg mt-6 overflow-hidden border border-[#425a66]/10"
    >
      <div className="p-6 space-y-6">
        <h3 className="text-2xl font-semibold text-[#4256a6] font-poppins border-b border-[#425a66]/10 pb-4">
          Finalizar Compra
        </h3>
        
        <div className="space-y-4">
          <div className="bg-[#dac9aa]/20 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-[#425a66] font-medium">Total a pagar</span>
              <span className="text-xl font-bold text-[#4256a6]">${total.toFixed(2)}</span>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-[#4256a6] text-white py-3 rounded-lg hover:bg-[#2a3875] transition-all duration-300 font-poppins shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Procesando pago...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Proceder al pago</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default Checkout;

