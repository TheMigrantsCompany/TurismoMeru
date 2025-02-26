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
          paymentStatus: "Pendiente",
          DNI: parseInt(attendees[0].dni),
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log("Orden de servicio creada:", serviceOrderResponse.data);

      // 2. Crear preferencia de pago
      const paymentPreference = await axios.post(
        `${import.meta.env.VITE_API_URL}/payment/create-preference`,
        {
          id_ServiceOrder: serviceOrderResponse.data.id_ServiceOrder,
          id_User: userId,
          DNI: attendees[0].dni,
          email: "email@del.usuario",
          paymentInformation: cartItems.map((item) => ({
            title: item.title,
            description: `Reserva para ${item.title}`,
            unit_price: parseFloat(item.price),
            totalPeople: quantity,
            id_Service: item.id_Service,
          })),
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log("Preferencia de pago creada:", paymentPreference.data);

      // 3. Redirigir a MercadoPago
      if (paymentPreference.data.preferenceId) {
        window.location.href = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${paymentPreference.data.preferenceId}`;
      } else {
        throw new Error("No se pudo obtener el ID de preferencia de pago");
      }
    } catch (error) {
      console.error("Error detallado:", {
        mensaje: error.message,
        respuesta: error.response?.data,
        estado: error.response?.status,
        config: error.config,
        datos_enviados: error.config?.data,
      });

      setError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Error al procesar la reserva"
      );

      alert(
        "Error al crear la orden: " +
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
