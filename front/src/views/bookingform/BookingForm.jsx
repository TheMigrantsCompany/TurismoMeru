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
  // Valor original de la fecha para enviar al backend
  const selectedDateRaw = queryParams.get("date") || "Fecha no disponible";
  const selectedTime = queryParams.get("time") || "Hora no disponible";
  const selectedQuantity = parseInt(queryParams.get("totalPeople")) || 1;

  // Función para formatear la fecha a dd/mm/yyyy (solo para mostrar)
  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    if (isNaN(dateObj)) return dateString;
    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Variable para mostrar la fecha formateada
  const displayDate = formatDate(selectedDateRaw);

  // Solo se permite llenar la información de un pasajero,
  // aunque la compra tenga más asientos.
  const [passenger, setPassenger] = useState({
    passengerName: "",
    dni: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handlePassengerChange = (field, value) => {
    setPassenger((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validación de campos
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

      const payload = {
        id_User: userId,
        id_ServiceOrder: serviceOrderId,
        paymentStatus: "Paid",
        DNI: passenger.dni,
        paymentInformation: [
          {
            id_Service: serviceId,
            serviceTitle,
            seatNumber: 1,
            DNI_Personal: passenger.dni,
            passengerName: passenger.passengerName || "Desconocido",
            // Se envía la fecha original al backend
            selectedDate: selectedDateRaw,
            selectedTime,
            lockedStock: 1,
            totalPeople: selectedQuantity,
            totalPrice: servicePrice,
          },
        ],
      };

      console.log("Payload que se enviará:", payload);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/booking`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Reserva creada:", response.data);

      // Mostrar mensaje de éxito y redirigir
      await Swal.fire({
        title: "Reserva confirmada",
        text: "Tu reserva se ha creado con éxito.",
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      navigate("/user/reservas");

      // Limpiar el formulario
      setPassenger({ passengerName: "", dni: "" });
    } catch (error) {
      setErrorMessage("Error al crear la reserva. Intenta nuevamente.");
      console.error(
        "Error al crear la reserva:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f9f3e1]">
      <form
        onSubmit={handleSubmit}
        className="max-w-lg w-full p-6 bg-[#f9f3e1] shadow-md rounded-lg space-y-6 text-[#4256a6]"
      >
        <h2 className="text-2xl font-bold text-center">
          Reserva para {serviceTitle}
        </h2>
        <div className="flex flex-col gap-2 text-lg">
          <p>
            <span className="font-semibold">Precio:</span> ${servicePrice}
          </p>
          <p>
            <span className="font-semibold">Fecha:</span> {displayDate}
          </p>
          <p>
            <span className="font-semibold">Hora:</span> {selectedTime}
          </p>
        </div>

        <div className="border p-4 rounded-md">
          <h3 className="text-xl font-semibold mb-4">Datos del Pasajero</h3>
          <Input
            type="text"
            placeholder="Nombre"
            value={passenger.passengerName}
            onChange={(e) => handlePassengerChange("passengerName", e.target.value)}
            className="mb-4 text-[#4256a6]"
          />
          <Input
            type="text"
            placeholder="DNI"
            value={passenger.dni}
            onChange={(e) => handlePassengerChange("dni", e.target.value)}
            className="mb-4 text-[#4256a6]"
          />
        </div>

        {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

        <Button type="submit" color="green" className="w-full">
          Reservar
        </Button>
      </form>
    </div>
  );
};

export default BookingForm;
