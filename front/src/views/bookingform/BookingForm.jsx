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

  // Obtener los valores sin formatear
  const rawDate = queryParams.get("date");
  const rawTime = queryParams.get("time");

  console.log("rawDate:", rawDate);
  console.log("rawTime:", rawTime);

  // Validar la fecha: si rawDate es válido se usa; de lo contrario se usa la fecha actual (YYYY-MM-DD)
  const selectedDate =
    rawDate && rawDate !== "Fecha no disponible" && !isNaN(new Date(rawDate))
      ? rawDate.trim()
      : new Date().toISOString().split("T")[0];

  // Validar la hora: si rawTime es válida se usa; de lo contrario se asigna "00:00"
  const selectedTime =
    rawTime && rawTime !== "Hora no disponible" && rawTime.trim() !== ""
      ? rawTime.trim()
      : "00:00";

  console.log("selectedDate:", selectedDate);
  console.log("selectedTime:", selectedTime);

  const selectedQuantity = parseInt(queryParams.get("totalPeople")) || 1;

  const [passenger, setPassenger] = useState({ passengerName: "", dni: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [reservationSuccess, setReservationSuccess] = useState(false);

  const handlePassengerChange = (field, value) => {
    setPassenger((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!passenger.passengerName.trim() || !passenger.dni.trim()) {
      setErrorMessage("Todos los campos son obligatorios.");
      return;
    }
    if (!/^[0-9]+$/.test(passenger.dni)) {
      setErrorMessage("El DNI debe contener solo números.");
      return;
    }
    if (!serviceOrderId) {
      setErrorMessage("ID de la orden de servicio inválido.");
      return;
    }

    try {
      // Primero, construir el array paymentInformation usando las claves "date" y "time"
      const paymentInformation = Array.from({ length: selectedQuantity }, (_, index) => ({
        id_Service: serviceId,
        lockedStock: 1,
        totalPeople: selectedQuantity,
        totalPrice: servicePrice,
        passengerName: passenger.passengerName || "Desconocido",
        date: selectedDate,    // se envía con clave "date"
        time: selectedTime,    // se envía con clave "time"
        seatNumber: index + 1
      }));

      console.log("ID de la orden de servicio:", serviceOrderId);
      console.log("📤 Enviando PATCH para actualizar estado de pago...");

      // Construir la URL usando la variable de entorno
      const url = `${import.meta.env.VITE_API_URL}/servicesOrder/id/${serviceOrderId}`;
      console.log("📡 URL de la solicitud PATCH:", url);

      // Realizar la solicitud PATCH, enviando también paymentInformation
      const patchResponse = await axios.patch(
        url,
        { 
          paymentStatus: "Pagado", 
          DNI: passenger.dni,
          paymentInformation
        },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("✅ Estado de pago actualizado correctamente.", patchResponse.data);

      console.log("📤 Enviando POST para crear la reserva...");
      console.log("Payload de reserva:", {
        id_User: userId,
        id_ServiceOrder: serviceOrderId,
        paymentStatus: "Pagado",
        DNI: passenger.dni,
        paymentInformation,
      });

      const postResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/booking`,
        {
          id_User: userId,
          id_ServiceOrder: serviceOrderId,
          paymentStatus: "Pagado",
          DNI: passenger.dni,
          paymentInformation,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("✅ Reserva creada con éxito.", postResponse.data);

      await Swal.fire({
        icon: "success",
        title: "¡Reserva exitosa!",
        text: "Tu reserva se ha creado con éxito. Serás redirigido a tus reservas.",
        timer: 2000,
        showConfirmButton: false,
      });

      setReservationSuccess(true);
      navigate("/user/reservas");
      setPassenger({ passengerName: "", dni: "" });
    } catch (error) {
      console.error("❌ Error en la operación:", error.response?.data || error.message);
      console.log("Detalles del error:", error);

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
    <form onSubmit={handleSubmit} className="space-y-4 bg-[#f9f3e1] p-6 rounded-xl shadow-md max-w-xl mx-auto">
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
