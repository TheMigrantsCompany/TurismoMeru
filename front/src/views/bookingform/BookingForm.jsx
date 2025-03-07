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

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validación de campos para el pasajero representante
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
      const bookingPayload = {
        id_User: userId,
        id_ServiceOrder: serviceOrderId,
        paymentStatus: "Paid",
        DNI: passenger.dni,
        paymentInformation: Array.from({ length: selectedQuantity }, (_, index) => ({
          id_Service: serviceId,
          serviceTitle,
          seatNumber: index + 1,
          DNI_Personal: "", 
          passengerName: "",
          selectedDate,
          selectedTime,
          lockedStock: 1,
          totalPeople: selectedQuantity,
          totalPrice: servicePrice,
        })),
      };

      console.log("Payload que se enviará:", bookingPayload);

      // Enviar la reserva
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/booking`,
        bookingPayload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Reserva creada:", response.data);

      // Luego de la reserva, actualizar el estado de pago de la orden
      const updateResponse = await axios.patch(
        `${import.meta.env.VITE_API_URL}/serviceOrder/id/${serviceOrderId}`,
        {
          paymentStatus: "Pagado", // Asegúrate de que coincida con lo que espera el backend
          DNI: passenger.dni,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Orden actualizada:", updateResponse.data);

      // Mostrar mensaje de éxito y redirigir
      await Swal.fire({
        icon: "success",
        title: "¡Reserva exitosa!",
        text: "Tu reserva se ha creado y el pago ha sido actualizado correctamente.",
        timer: 2000,
        showConfirmButton: false,
      });

      setReservationSuccess(true);
      navigate("/user/reservas");

      // Reiniciar la información del pasajero
      setPassenger({ passengerName: "", dni: "" });
    } catch (error) {
      setErrorMessage("Error al crear la reserva o actualizar el pago. Intenta nuevamente.");
      console.error(
        "Error en el proceso:",
        error.response?.data || error.message
      );
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
