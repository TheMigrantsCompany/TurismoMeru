import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const PaymentPending = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f9f3e1] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#dac9aa] p-8 rounded-xl shadow-lg max-w-md w-full text-center border-2 border-[#425a66]"
      >
        <div className="mb-6">
          <svg
            className="w-20 h-20 mx-auto text-yellow-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-[#4256a6] mb-4">
          Pago Pendiente
        </h1>
        
        <p className="text-[#152917] mb-6">
           Ha ocurrido un problema con el pago. Por favor, comunícate con nosotros para completar tu reserva.
        </p>

        <div className="space-y-4">
          <a
            href="https://wa.me/+541169084059"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white py-2 rounded-lg hover:bg-[#128C7E] transition-colors duration-300"
          >
            <img
              src="https://img.icons8.com/fluent/24/000000/whatsapp.png"
              alt="WhatsApp"
              className="w-6 h-6"
            />
            Contactar por WhatsApp
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentPending;