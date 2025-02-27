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
  const [attendees, setAttendees] = useState([{ dni: "", passengerName: "" }]);
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
      DNI: attendees[0]?.dni,
      paymentStatus: "Paid",
      paymentInformation: attendees.map((attendee, i) => ({
      id_Service: serviceId,
      serviceTitle,
      seatNumber: i + 1,
      DNI_Personal: attendee.dni,
      passengerName: attendee.passengerName || "Desconocido",
      date: bookingDate,
      time: bookingTime,
      lockedStock: selectedQuantity,
      totalPeople: selectedQuantity,
       totalPrice: parseFloat(servicePrice) * selectedQuantity,
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
      <h2 className="text-xl font-semibold">Reserva para {serviceTitle}</h2>
      <p>Precio: ${servicePrice}</p>
      <p>Fecha: {bookingDate}</p>
      <p>Hora: {bookingTime}</p>

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
