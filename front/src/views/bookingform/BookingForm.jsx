import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Input, Button } from "@material-tailwind/react";
import Swal from "sweetalert2";

const BookingForm = ({ userId }) => {
  const location = useLocation();
  const navigate = useNavigate(); // Usamos navigate para redirigir
  const queryParams = new URLSearchParams(location.search);

  const serviceId = queryParams.get("id_Service");
  const serviceTitle = queryParams.get("title");
  const servicePrice = parseFloat(queryParams.get("price")) || 0;
  const serviceOrderId = queryParams.get("id_ServiceOrder");

  const selectedDate = queryParams.get("date") || "Fecha no disponible";
  const selectedTime = queryParams.get("time") || "Hora no disponible"; // Hora seleccionada por el usuario
  const selectedQuantity = parseInt(queryParams.get("totalPeople")) || 1;

  const [passengers, setPassengers] = useState(
    Array.from({ length: selectedQuantity }, () => ({
      passengerName: "",
      dni: "",
    }))
  );

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handlePassengerChange = (index, field, value) => {
    setPassengers((prevPassengers) =>
      prevPassengers.map((p, i) =>
        i === index ? { ...p, [field]: value } : p
      )
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validación básica
    for (let i = 0; i < passengers.length; i++) {
      if (!passengers[i].passengerName.trim() || !passengers[i].dni.trim()) {
        setErrorMessage("Todos los campos son obligatorios.");
        return;
      }
      if (!/^\d+$/.test(passengers[i].dni)) {
        setErrorMessage("El DNI debe contener solo números.");
        return;
      }
    }

    try {
      setErrorMessage("");
      setSuccessMessage("");

      const payload = {
        id_User: userId,
        id_ServiceOrder: serviceOrderId,
        paymentStatus: "Paid",
        DNI: passengers[0]?.dni || "", // Asigna el DNI del primer pasajero
        paymentInformation: passengers.map((passenger, index) => ({
          id_Service: serviceId,
          serviceTitle,
          seatNumber: index + 1,
          DNI_Personal: passenger.dni,
          passengerName: passenger.passengerName || "Desconocido",
          selectedDate,
          selectedTime, // Hora seleccionada por el usuario
          lockedStock: 1,
          totalPeople: selectedQuantity,
          totalPrice: servicePrice,
        })),
      };

      console.log("Payload que se enviará:", payload);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/booking`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log("Reserva creada:", response.data);

      // Mostrar SweetAlert con el mensaje de éxito
     Swal.fire({
       title: "Reserva exitosa",
       text: "Tu reserva se ha realizado con éxito.",
       icon: "success",
       confirmButtonText: "Ir a mis reservas",
     }).then((result) => {
  console.log("SweetAlert cerrado, resultado:", result);
    if (result.isConfirmed) {
    console.log("Redirigiendo a /user/reservas...");
    navigate("/user/reservas");
  }
});

// Redirección de respaldo después de 2 segundos
setTimeout(() => {
  console.log("Redirección forzada a /user/reservas...");
  navigate("/user/reservas");
}, 2000);



      // Limpiar los campos
      setPassengers(
        Array.from({ length: selectedQuantity }, () => ({
          passengerName: "",
          dni: "",
        }))
      );
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

      {passengers.map((passenger, index) => (
        <div key={index} className="border p-4 rounded-md">
          <h3>Pasajero {index + 1}</h3>
          <Input
            type="text"
            placeholder="Nombre"
            value={passenger.passengerName}
            onChange={(e) => handlePassengerChange(index, "passengerName", e.target.value)}
          />
          <Input
            type="text"
            placeholder="DNI"
            value={passenger.dni}
            onChange={(e) => handlePassengerChange(index, "dni", e.target.value)}
          />
        </div>
      ))}

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}

      <Button type="submit" color="green">
        Reservar
      </Button>
    </form>
  );
};

export default BookingForm;
