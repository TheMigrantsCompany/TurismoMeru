import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Input, Button } from "@material-tailwind/react";

const BookingForm = ({ userId }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const serviceId = queryParams.get("id_Service");
  const serviceTitle = queryParams.get("title");
  const servicePrice = queryParams.get("price");
  const serviceOrderId = queryParams.get("id_ServiceOrder");

  // Captura de la fecha y hora seleccionadas desde los query params
  const selectedDate = queryParams.get("date") || "Fecha no disponible";
  const selectedTime = queryParams.get("time") || "Hora no disponible";

  const [selectedQuantity, setSelectedQuantity] = useState(1);
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
      setErrorMessage(""); // Limpiar mensajes de error previos
      
   const payload = {
    id_User: userId,
    id_ServiceOrder: serviceOrderId,
    DNI: globalDNI.toString(),
    paymentStatus: "Paid",
    paymentInformation: [{
    id_Service: serviceId,
    serviceTitle,
    seatNumber: 1,
    DNI_Personal: globalDNI.toString(),
    passengerName: passengerName || "Desconocido",
    selectedDate: selectedDate,  
    selectedTime: selectedTime,  
    lockedStock: selectedQuantity,
    totalPeople: selectedQuantity,
    totalPrice: parseFloat(servicePrice) * selectedQuantity,
  }],
};

      console.log("Payload que se enviará:", payload);

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/booking`, payload);
      console.log("Reserva creada:", response.data);

      setPassengerName("");
      setGlobalDNI("");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Error al crear la reserva. Intenta nuevamente.");
      console.error("Error al crear la reserva:", error.response?.data || error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">Reserva para {serviceTitle}</h2>
      <p>Precio: ${servicePrice}</p>
      <p>Fecha: {selectedDate}</p>
      <p>Hora: {selectedTime}</p>

      <div>
        <label htmlFor="passengerName" className="block text-sm font-medium text-gray-700">
          Nombre del Pasajero
        </label>
        <Input
          id="passengerName"
          type="text"
          value={passengerName}
          onChange={(e) => setPassengerName(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="globalDNI" className="block text-sm font-medium text-gray-700">
          DNI
        </label>
        <Input
          id="globalDNI"
          type="text"
          value={globalDNI}
          onChange={(e) => setGlobalDNI(e.target.value)}
          required
        />
      </div>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <Button type="submit" color="green">
        Reservar
      </Button>
    </form>
  );
};

export default BookingForm;
