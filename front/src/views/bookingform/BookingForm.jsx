import React, { useState } from "react";
import axios from "axios";
import { Card, Typography, Button, Input } from "@material-tailwind/react";
import { useCart } from "../shopping-cart/CartContext";

const BookingForm = ({ serviceId, quantity, serviceTitle, userId, price }) => {
  const { clearCart, cartItems } = useCart();
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
      // 1. Primero crear la orden de servicio
      const serviceOrderResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/servicesOrder`,
        {
          orderDate: new Date().toISOString(),
          id_User: userId,
          paymentMethod: "Pagos desde Argentina",
          items: cartItems,
          paymentStatus: "Paid", // Cambiado de Pendiente a Paid
          DNI: attendees[0].dni, // Agregamos el DNI del primer asistente
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log("Orden de servicio creada:", serviceOrderResponse.data);

      // 2. Luego crear las reservas
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/booking`,
        {
          id_User: userId,
          paymentStatus: "Paid",
          id_ServiceOrder: serviceOrderResponse.data.id_ServiceOrder, // Agregamos el ID de la orden
          paymentInformation: attendees.map((attendee, i) => ({
            id_Service: serviceId,
            serviceTitle: serviceTitle,
            DNI: parseInt(attendee.dni),
            passengerName: attendee.name,
            seatNumber: i + 1,
            bookingDate: new Date(
              `${attendee.bookingDate}T${attendee.bookingTime}:00`
            ),
            active: true,
            totalPeople: quantity,
            totalPrice: price || 0,
            dateTime: `${attendee.bookingDate}T${attendee.bookingTime}:00`,
          })),
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
          timeout: 10000,
        }
      );

      console.log("Reservas creadas:", response.data);
      alert("¡Reservas creadas con éxito!");
      clearCart();
    } catch (error) {
      console.error("Error detallado:", {
        mensaje: error.message,
        respuesta: error.response?.data,
        estado: error.response?.status,
        config: error.config,
      });

      setError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Error al procesar la reserva"
      );

      alert(
        "Error al crear las reservas: " +
          (error.response?.data?.error || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(date).toLocaleDateString("es-ES", options);
  };

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6 bg-white shadow-lg rounded-lg">
        <Typography
          variant="h4"
          className="text-[#4256a6] mb-6 font-poppins text-center"
        >
          Formulario de Reserva para {serviceTitle}
        </Typography>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {attendees.map((attendee, index) => (
            <Card
              key={index}
              className="p-4 mb-4 bg-[#f9f3e1] border-l-4 border-[#425a66]"
            >
              <Typography
                variant="h6"
                className="text-[#4256a6] mb-4 font-poppins"
              >
                Asistente {index + 1}
              </Typography>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    type="text"
                    label="Nombre Completo"
                    value={attendee.name}
                    onChange={(e) =>
                      handleChange(index, "name", e.target.value)
                    }
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4256a6]"
                    required
                  />
                </div>

                <div>
                  <Input
                    type="text"
                    label="DNI"
                    value={attendee.dni}
                    onChange={(e) => handleChange(index, "dni", e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4256a6]"
                    required
                  />
                </div>

                <div>
                  <Typography variant="small" className="text-gray-700 mb-1">
                    Fecha de Reserva
                  </Typography>
                  <Input
                    type="date"
                    value={attendee.bookingDate}
                    onChange={(e) =>
                      handleChange(index, "bookingDate", e.target.value)
                    }
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4256a6]"
                    required
                  />
                  <Typography variant="small" className="mt-1 text-gray-600">
                    {formatDate(attendee.bookingDate)}
                  </Typography>
                </div>

                <div>
                  <Typography variant="small" className="text-gray-700 mb-1">
                    Hora de Reserva
                  </Typography>
                  <Input
                    type="time"
                    value={attendee.bookingTime}
                    onChange={(e) =>
                      handleChange(index, "bookingTime", e.target.value)
                    }
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4256a6]"
                    required
                  />
                  <Typography variant="small" className="mt-1 text-gray-600">
                    {formatTime(attendee.bookingTime)}
                  </Typography>
                </div>
              </div>
            </Card>
          ))}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4256a6] text-white py-3 rounded-lg hover:bg-[#2a3875] transition-all duration-300 font-poppins disabled:bg-gray-400"
          >
            {loading ? "Procesando..." : "Confirmar Reservas"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default BookingForm;
