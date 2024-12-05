import React, { useEffect } from "react";

const GetnetPayment = ({ orderId, amount, sellerId, onSuccess, onError }) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.getnet.com.br/sandbox/javascript/getnet.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = () => {
    if (window.Getnet) {
      const paymentData = {
        seller_id: sellerId, // Dinámico
        amount: amount,
        currency: "ARS",
        order_id: orderId,
        payment_type: "credit_card",
        customer: {
          name: "John Doe", // Este dato puedes hacerlo dinámico
          email: "john.doe@example.com", // Este dato también
        },
      };

      window.Getnet.checkout({
        data: paymentData,
        onSuccess: (response) => onSuccess(response),
        onError: (error) => onError(error),
      });
    } else {
      console.error("El script de Getnet no se ha cargado correctamente.");
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg shadow hover:bg-red-600 transition"
    >
      Pagar con Getnet
    </button>
  );
};

export default GetnetPayment;