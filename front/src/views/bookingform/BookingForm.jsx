import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Input, Button } from "@material-tailwind/react";

const BookingForm = ({ userId }) => {
  // Obtener datos de la URL
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const serviceId = queryParams.get("id_Service");
  const serviceTitle = queryParams.get("title");
  const servicePrice = queryParams.get("price");
  const serviceOrderId = queryParams.get("id_ServiceOrder");
  const bookingDate = queryParams.get("date");
  const bookingTime = queryParams.get("time");

  const [selectedQuantity, setSelectedQuantity] = useState(1);
  // Estados para DNI y nombre del pasajero, en lugar de un array de asistentes
  const [globalDNI, setGlobalDNI] = useState("");
  const [passengerName, setPassengerName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validación básica
    if (!passengerName.trim() || !globalDNI.trim()) {
      setErrorMessage("Todos los campos son obligatorios.");
      return;
    }
    if (!/^\d+$/.test(globalDNI)) {
      setErrorMessage("El DNI debe contener solo números.");
      return;
    }

    try {
      setErrorMessage("");
      
      // Preparar el payload usando el DNI global
      const payload = {
        id_User: userId,
        id_ServiceOrder: serviceOrderId,
        DNI: globalDNI, // DNI global
        paymentStatus: "Paid",
        paymentInformation: [{
          id_Service: serviceId,
          serviceTitle,
          seatNumber: 1,
          DNI_Personal: globalDNI, // mismo DNI para el pasajero principal
          passengerName: passengerName || "Desconocido",
          date: bookingDate,
          time: bookingTime,
          lockedStock: selectedQuantity,
          totalPeople: selectedQuantity,
          totalPrice: parseFloat(servicePrice) * selectedQuantity,
        }],
      };

      console.log("Payload a enviar:", payload);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/booking`, payload);
      console.log("Reserva creada:", response.data);
    } catch (error) {
      setErrorMessage("Error al crear la reserva. Intenta nuevamente.");
      console.error("Error al crear la reserva:", error.response?.data || error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">Reserva para {serviceTitle}</h2>
      <p>Precio: ${servicePrice}</p>
      <p>Fecha: {bookingDate}</p>
      <p>Hora: {bookingTime}</p>

      <Input
        type="text"
        label="Nombre del Pasajero"
        value={passengerName}
        onChange={(e) => setPassengerName(e.target.value)}
        required
      />
      <Input
        type="text"
        label="DNI"
        value={globalDNI}
        onChange={(e) => setGlobalDNI(e.target.value)}
        required
      />

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <Button type="submit" color="green">
        Reservar
      </Button>
    </form>
  );
};

export default BookingForm;
