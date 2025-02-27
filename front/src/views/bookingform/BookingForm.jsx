import React, { useState } from "react";
import axios from "axios";
import { Input, Button } from "@material-tailwind/react";

const BookingForm = ({ 
  userId, 
  serviceId, 
  serviceTitle, 
  servicePrice, 
  serviceOrderId, 
  bookingDate,  // Fecha de la reserva predefinida
  bookingTime   // Hora de la reserva predefinida
}) => {
  const [attendees, setAttendees] = useState([
    { dni: "", passengerName: "" },
  ]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (index, field, value) => {
    const updatedAttendees = [...attendees];
    updatedAttendees[index][field] = value;
    setAttendees(updatedAttendees);
  };

  const addAttendee = () => {
    setAttendees([...attendees, { dni: "", passengerName: "" }]);
  };

  const removeAttendee = (index) => {
    if (attendees.length > 1) {
      setAttendees(attendees.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validación básica
    for (const attendee of attendees) {
      if (!attendee.passengerName.trim() || !attendee.dni.trim()) {
        setErrorMessage("Todos los campos son obligatorios.");
        return;
      }
      if (!/^\d+$/.test(attendee.dni)) {
        setErrorMessage("El DNI debe contener solo números.");
        return;
      }
    }

    try {
      setErrorMessage(""); // Reset error
      const quantity = attendees.length;

      const payload = {
        id_User: userId,
        id_ServiceOrder: serviceOrderId,
        paymentStatus: "Paid",
        paymentInformation: attendees.map((attendee, i) => ({
          id_Service: serviceId,
          serviceTitle,
          seatNumber: i + 1,
          DNI_Personal: attendee.dni,
          passengerName: attendee.passengerName || "Desconocido",
          date: bookingDate,  // Se usa la fecha predefinida
          time: bookingTime,  // Se usa la hora predefinida
        })),
      };

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/booking`, payload);
      console.log("Reserva creada:", response.data);
    } catch (error) {
      setErrorMessage("Error al crear la reserva. Intenta nuevamente.");
      console.error("Error al crear la reserva:", error.response?.data || error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {attendees.map((attendee, index) => (
        <div key={index} className="flex flex-col gap-2 border p-4 rounded-lg">
          <Input
            type="text"
            label="Nombre del Pasajero"
            value={attendee.passengerName}
            onChange={(e) => handleChange(index, "passengerName", e.target.value)}
            required
          />
          <Input
            type="text"
            label="DNI"
            value={attendee.dni}
            onChange={(e) => handleChange(index, "dni", e.target.value)}
            required
          />
          <Input
            type="date"
            label="Fecha de Reserva"
            value={bookingDate}
            readOnly
          />
          <Input
            type="time"
            label="Hora de Reserva"
            value={bookingTime}
            readOnly
          />
          {index > 0 && (
            <Button type="button" color="red" onClick={() => removeAttendee(index)}>
              Eliminar
            </Button>
          )}
        </div>
      ))}
      
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <Button type="button" color="blue" onClick={addAttendee}>
        Añadir Pasajero
      </Button>
      <Button type="submit" color="green">
        Reservar
      </Button>
    </form>
  );
};

export default BookingForm;
