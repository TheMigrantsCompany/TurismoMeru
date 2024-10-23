import React from 'react';

const Checkout = ({ total }) => {
  const handlePayment = () => {
    // Lógica para procesar el pago
    alert(`Pagando ${total.toFixed(2)} dólares`);
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-black">Checkout</h2>
      <p className="text-black mb-4">Total a pagar: ${total.toFixed(2)}</p>
      <button 
        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
        onClick={handlePayment}
      >
        Realizar Pago
      </button>
    </div>
  );
};

export default Checkout;