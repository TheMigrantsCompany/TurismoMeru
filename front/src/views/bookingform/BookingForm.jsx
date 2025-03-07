import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Input, Button } from "@material-tailwind/react";
import Swal from "sweetalert2";

const BookingForm = ({ userId }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const serviceId = queryParams.get("id_Service");
  const serviceTitle = queryParams.get("title");
  const servicePrice = parseFloat(queryParams.get("price")) || 0;
  const serviceOrderId = queryParams.get("id_ServiceOrder");
  const selectedDate = queryParams.get("date") || "Fecha no disponible";
  const selectedTime = queryParams.get("time") || "Hora no disponible";
  const selectedQuantity = parseInt(queryParams.get("totalPeople")) || 1;

  // Estado para la información del pasajero
  const [passenger, setPassenger] = useState({ passengerName: "", dni: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [reservationSuccess, setReservationSuccess] = useState(false);

  const handlePassengerChange = (field, value) => {
    setPassenger((prev) => ({ ...prev, [field]: value }));
  };

  console.log("Service Order ID:", serviceOrderId);
  console.log("Service ID:", serviceId);
  console.log("Total Personas:", selectedQuantity);
  console.log("Precio del servicio:", servicePrice);
  
  const handleSubmit = async (event) => {
    console.log("➡️ Enviando formulario de reserva...");
    console.log("Datos del pasajero:", passenger);
    event.preventDefault();

    if (!passenger.passengerName.trim() || !passenger.dni.trim()) {
      setErrorMessage("Todos los campos son obligatorios.");
      return;
    }
    if (!/^\d+$/.test(passenger.dni)) {
      setErrorMessage("El DNI debe contener solo números.");
      return;
    }

    try {
      setErrorMessage("");

      // Payload para la reserva
      const payload = {
        id_User: userId,
        id_ServiceOrder: serviceOrderId,
        paymentStatus: "Paid",
        DNI: passenger.dni,
        paymentInformation: Array.from({ length: selectedQuantity }, (_, index) => ({
          id_Service: serviceId,
          serviceTitle,
          seatNumber: index + 1,
          DNI_Personal: passenger.dni,
          passengerName: passenger.passengerName || "Desconocido",
          selectedDate,
          selectedTime,
          lockedStock: 1,
          totalPeople: selectedQuantity,
          totalPrice: servicePrice,
        })),
      };

      console.log("Payload de reserva:", payload);
      console.log("API URL:", import.meta.env.VITE_API_URL);

      // Enviar la reserva
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/booking`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("✅ Reserva creada con éxito:", response.data);

      // ✅ ACTUALIZAR ESTADO DE PAGO DE LA ORDEN DE SERVICIO
      const paymentUpdatePayload = { paymentStatus: "Paid", DNI: passenger.dni };
      
      console.log("📤 Enviando actualización de pago...", paymentUpdatePayload);

      await axios.patch(
        `${import.meta.env.VITE_API_URL}/serviceOrder/id/${serviceOrderId}`,
        paymentUpdatePayload,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("✅ Estado de pago actualizado a 'Paid'");

      // Mostrar mensaje de éxito
      await Swal.fire({
        icon: "success",
        title: "¡Reserva exitosa!",
        text: "Tu reserva se ha creado con éxito. Serás redirigido a tus reservas.",
        timer: 2000,
        showConfirmButton: false,
      });

      setReservationSuccess(true);
      navigate("/user/reservas");

      // Reiniciar la información del pasajero
      setPassenger({ passengerName: "", dni: "" });
    } catch (error) {
      setErrorMessage("Error al crear la reserva. Intenta nuevamente.");
      console.error("❌ Error al crear la reserva o actualizar pago:", error.response?.data || error.message);
    }
  };


  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-[#f9f3e1] p-6 rounded-xl shadow-md max-w-xl mx-auto"
    >
      <h2 className="text-xl font-semibold text-[#4256a6]">
        Reserva para {serviceTitle}
      </h2>
      <p className="font-semibold text-[#4256a6]">
        Precio: <span className="font-normal text-[#425a66]">${servicePrice}</span>
      </p>
      <p className="font-semibold text-[#4256a6]">
        Fecha: <span className="font-normal text-[#425a66]">{selectedDate}</span>
      </p>
      <p className="font-semibold text-[#4256a6]">
        Hora: <span className="font-normal text-[#425a66]">{selectedTime}</span>
      </p>

      <div className="border p-4 rounded-md shadow-md bg-white">
        <h3 className="font-medium text-[#4256a6]">Información del Pasajero</h3>
        <Input
          type="text"
          placeholder="Nombre"
          value={passenger.passengerName}
          onChange={(e) => handlePassengerChange("passengerName", e.target.value)}
          className="mt-2"
        />
        <Input
          type="text"
          placeholder="DNI"
          value={passenger.dni}
          onChange={(e) => handlePassengerChange("dni", e.target.value)}
          className="mt-2"
        />
      </div>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {reservationSuccess && (
        <p className="text-green-500 font-semibold">
          ¡Tu reserva se ha creado con éxito! Redirigiendo...
        </p>
      )}

      <Button type="submit" color="green" className="w-full">
        Reservar
      </Button>
    </form>
  );
};

export default BookingForm;
