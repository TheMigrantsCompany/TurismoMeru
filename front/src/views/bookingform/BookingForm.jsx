import React, { useState, useEffect } from "react";
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

  // Asegúrate de que los query params tengan valores válidos
  const selectedDate = queryParams.get("date") || "Fecha no disponible";
  const selectedTime = queryParams.get("time") || "Hora no disponible";

  console.log("Fecha seleccionada:", selectedDate);
  console.log("Hora seleccionada:", selectedTime);
  // Console.log de los query params para confirmar que llegan correctamente
  console.log("Query Params:", {
    serviceId,
    serviceTitle,
    servicePrice,
    serviceOrderId,
    selectedDate,
    selectedTime,
  });

  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [globalDNI, setGlobalDNI] = useState("");
  const [passengerName, setPassengerName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Submit iniciado");

    // Validación básica
    if (!passengerName.trim() || !globalDNI.trim()) {
      setErrorMessage("Todos los campos son obligatorios.");
      console.log("Error: Todos los campos son obligatorios.");
      return;
    }
    if (!/^\d+$/.test(globalDNI)) {
      setErrorMessage("El DNI debe contener solo números.");
      console.log("Error: El DNI debe contener solo números.");
      return;
    }

    try {
      setErrorMessage(""); // Limpiar mensajes de error previos

      // Preparar el payload usando el DNI global
      const payload = {
        id_User: userId,
        id_ServiceOrder: serviceOrderId,
        DNI: parseInt(globalDNI, 10),
        paymentStatus: "Paid",
        paymentInformation: [{
          id_Service: serviceId,
          serviceTitle,
          seatNumber: 1,
          DNI_Personal: parseInt(globalDNI, 10),
          passengerName: passengerName || "Desconocido",
          date: selectedDate,  // Usar selectedDate
          time: selectedTime,  // Usar selectedTime
          lockedStock: selectedQuantity,
          totalPeople: selectedQuantity,
          totalPrice: parseFloat(servicePrice) * selectedQuantity,
        }],
      };

      // Loggear el payload antes de enviarlo al backend
      console.log("Datos a enviar al backend:", JSON.stringify(payload, null, 2));

      // Realizar la solicitud POST
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/booking`, payload);
      console.log("Reserva creada:", response.data);

      // Limpiar campos después de la creación
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
          name="passengerName"
          value={passengerName}
          onChange={(e) => {
            setPassengerName(e.target.value);
            console.log("onChange - passengerName:", e.target.value);
          }}
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
          name="globalDNI"
          value={globalDNI}
          onChange={(e) => {
            setGlobalDNI(e.target.value);
            console.log("onChange - globalDNI:", e.target.value);
          }}
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
