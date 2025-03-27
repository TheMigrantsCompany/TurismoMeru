import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../shopping-cart/CartContext";
import { Button } from "@material-tailwind/react";
import Swal from "sweetalert2";

const BookingForm = ({ userId, userName, userDni }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const queryParams = new URLSearchParams(location.search);

  const serviceId = queryParams.get("id_Service");
  const serviceTitle = queryParams.get("title");
  const servicePrice = Math.round(parseFloat(queryParams.get("price")) * 100) / 100 || 0;
  const serviceOrderId = queryParams.get("id_ServiceOrder");

  // Obtener y formatear fecha y hora
  const rawDate = queryParams.get("date");
  const rawTime = queryParams.get("time");

  const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && dateString.match(/^\d{4}-\d{2}-\d{2}$/);
  };

  const selectedDate =
    rawDate && rawDate !== "Fecha no disponible" && isValidDate(rawDate)
      ? rawDate.trim()
      : new Date().toISOString().split("T")[0];

  const formatTime = (time) => {
    return time && time.length === 8 ? time.slice(0, 5) : time || "00:00";
  };

  const selectedTime = rawTime ? formatTime(rawTime) : "00:00";
  const selectedQuantity = parseInt(queryParams.get("totalPeople")) || 1;
  const totalPrice = Number(queryParams.get("totalPrice")) || (selectedQuantity * parseFloat(servicePrice));

  const [errorMessage, setErrorMessage] = useState("");
  const [reservationSuccess, setReservationSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!serviceOrderId) {
      setErrorMessage("ID de la orden de servicio inválido.");
      return;
    }

    try {
      const paymentInformation = Array.from({ length: selectedQuantity }, (_, index) => ({
        id_Service: serviceId,
        lockedStock: 1,
        totalPeople: selectedQuantity,
        totalPrice: totalPrice,
        selectedDate, 
        selectedTime,
        date: selectedDate,
        time: selectedTime,
        seatNumber: index + 1,
        passengerName: index === 0 ? userName : "Desconocido",
        DNI: index === 0 ? userDni : "" 
      }));

      const url = `${import.meta.env.VITE_API_URL}/servicesOrder/id/${serviceOrderId}`;
      const patchResponse = await axios.patch(
        url,
        { 
          paymentStatus: "Pagado", 
          DNI: userDni, 
          paymentInformation
        },
        { headers: { "Content-Type": "application/json" } }
      );
      
     await Swal.fire({
       icon: "success",
       title: "¡Reserva exitosa!",
       text: "Tu reserva se ha creado con éxito. Serás redirigido a tus reservas.",
       timer: 1500,
       showConfirmButton: false,
       }).then(() => {
        clearCart();
        setReservationSuccess(true);
        navigate("/user/reservas");
      });
    } catch (error) {
      if (error.response?.status === 404) {
        setErrorMessage("Orden de servicio no encontrada.");
      } else if (error.response?.status === 400) {
        setErrorMessage("Los datos enviados no son válidos.");
      } else {
        setErrorMessage("Ocurrió un error. Intenta nuevamente.");
      }
    }
  };

  return (
    <div className="space-y-4 bg-[#f9f3e1] p-6 rounded-xl shadow-md max-w-xl mx-auto">
      <h2 className="text-xl font-semibold text-[#4256a6]">
        Reserva para {serviceTitle}
      </h2>
      <p className="font-semibold text-[#4256a6]">
        Precio: <span className="font-normal text-[#425a66]">${servicePrice.toFixed(2)}</span>
      </p>
      <p className="font-semibold text-[#4256a6]">
        Fecha: <span className="font-normal text-[#425a66]">{selectedDate}</span>
      </p>
      <p className="font-semibold text-[#4256a6]">
        Hora: <span className="font-normal text-[#425a66]">{selectedTime}</span>
      </p>
      <p className="font-semibold text-[#4256a6]">
        Cantidad de Pasajeros: <span className="font-normal text-[#425a66]">{selectedQuantity}</span>
      </p>
      <p className="font-semibold text-[#4256a6]">
         Total Pagado:{" "}
        <span className="font-normal text-[#425a66]">
        ${totalPrice.toFixed(2)}
        </span>
      </p>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {reservationSuccess && (
        <p className="text-green-500 font-semibold">
          ¡Tu reserva se ha creado con éxito! Redirigiendo...
        </p>
      )}

      <Button onClick={handleSubmit} color="green" className="w-full">
        Confirmar Reserva
      </Button>
    </div>
  );
};

export default BookingForm;
