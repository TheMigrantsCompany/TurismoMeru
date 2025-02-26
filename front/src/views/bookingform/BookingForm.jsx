import React, { useState } from "react";
import axios from "axios";
import { Card, Typography, Button, Input } from "@material-tailwind/react";
import { useCart } from "../shopping-cart/CartContext";

const BookingForm = ({ serviceId, quantity, serviceTitle, userId }) => {
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [attendees, setAttendees] = useState(
    Array.from({ length: quantity }, () => ({
      name: "",
      dni: "",
      bookingDate: new Date().toISOString().split("T")[0],
      bookingTime: "12:00",
    }))
  );

  const handleChange = (index, field, value) => {
    const updatedAttendees = [...attendees];
    updatedAttendees[index][field] = value;
    setAttendees(updatedAttendees);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log("Creando reserva...");
      const bookingData = {
        id_User: userId,
        id_Service: serviceId,
        attendees,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/booking`,
        bookingData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log("Reserva creada:", response.data);
      alert("Reserva confirmada exitosamente");
      clearCart();
    } catch (error) {
      console.error("Error al crear la reserva:", error.response?.data || error.message);
      setError("Hubo un error al procesar la reserva. Inténtalo nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6 bg-white shadow-lg rounded-lg">
        <Typography variant="h4" className="text-[#4256a6] mb-6 text-center">
          Formulario de Reserva para {serviceTitle}
        </Typography>

        {error && <div className="text-red-700 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {attendees.map((attendee, index) => (
            <Card key={index} className="p-4 mb-4 bg-[#f9f3e1] border-l-4 border-[#425a66]">
              <Typography variant="h6" className="text-[#4256a6] mb-4">
                Asistente {index + 1}
              </Typography>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="text"
                  label="Nombre Completo"
                  value={attendee.name}
                  onChange={(e) => handleChange(index, "name", e.target.value)}
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
                  value={attendee.bookingDate}
                  onChange={(e) => handleChange(index, "bookingDate", e.target.value)}
                  required
                />
                <Input
                  type="time"
                  value={attendee.bookingTime}
                  onChange={(e) => handleChange(index, "bookingTime", e.target.value)}
                  required
                />
              </div>
            </Card>
          ))}

          <Button type="submit" disabled={loading} className="w-full bg-[#4256a6] text-white py-3 rounded-lg">
            {loading ? "Procesando..." : "Confirmar Reserva"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default BookingForm;
