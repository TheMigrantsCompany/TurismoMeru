import React, { useState } from 'react';
import axios from 'axios';
import { Card, Typography, Button, Input } from "@material-tailwind/react";
import { useCart } from "../shopping-cart/CartContext"; // Importa el hook

const BookingForm = ({ serviceId, quantity, serviceTitle, userId, serviceOrderId, servicePrice }) => {
  const { clearCart } = useCart(); // Extrae clearCart del contexto

  const [attendees, setAttendees] = useState(
    Array.from({ length: quantity }, () => ({
      name: '',
      dni: '',
      bookingDate: new Date().toISOString().split('T')[0],
      bookingTime: '12:00'
    }))
  );

  const handleChange = (index, field, value) => {
    const updatedAttendees = [...attendees];
    updatedAttendees[index][field] = value;
    setAttendees(updatedAttendees);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (attendees.length === 0) {
      alert('Debe haber al menos un pasajero registrado.');
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/booking`, {
        id_User: userId,
        paymentStatus: 'Paid',
        id_ServiceOrder: serviceOrderId, // 🔹 Asegúrate de obtener este ID después del pago
        paymentInformation: attendees.map((attendee) => ({
          id_Service: serviceId, // ✅ Corregido: antes era "ServiceId"
          serviceTitle,
          lockedStock: 1, // ✅ Cada pasajero ocupa un lugar
          totalPeople: 1, // ✅ Cada reserva representa a un solo pasajero
          totalPrice: servicePrice, // 🔹 Asegúrate de obtener el precio real del servicio
          date: attendee.bookingDate, // ✅ Extraído de bookingDate
          time: attendee.bookingTime, // ✅ Extraído de bookingTime
          passengerName: attendee.name || 'Desconocido', // ✅ Se usa "Desconocido" si no hay nombre
          DNI: attendee.dni // ✅ Cada pasajero tiene su propio DNI
        })),
      });

      console.log('Reservas creadas:', response.data);
      alert('¡Reservas creadas con éxito!');

      // Vacía el carrito una vez que la reserva se creó exitosamente
      clearCart();

    } catch (error) {
      console.error('Error al crear reservas:', error);
      alert('Hubo un problema al crear las reservas.');
    }
  };

  const formatDate = (date) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(date).toLocaleDateString('es-ES', options);
  };

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6 bg-white shadow-lg rounded-lg">
        <Typography variant="h4" className="text-[#4256a6] mb-6 font-poppins text-center">
          Formulario de Reserva para {serviceTitle}
        </Typography>

        <form onSubmit={handleSubmit} className="space-y-6">
          {attendees.map((attendee, index) => (
            <Card key={index} className="p-4 mb-4 bg-[#f9f3e1] border-l-4 border-[#425a66]">
              <Typography variant="h6" className="text-[#4256a6] mb-4 font-poppins">
                Asistente {index + 1}
              </Typography>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    type="text"
                    label="Nombre Completo"
                    value={attendee.name}
                    onChange={(e) => handleChange(index, 'name', e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4256a6]"
                    required
                  />
                </div>

                <div>
                  <Input
                    type="text"
                    label="DNI"
                    value={attendee.dni}
                    onChange={(e) => handleChange(index, 'dni', e.target.value)}
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
                    onChange={(e) => handleChange(index, 'bookingDate', e.target.value)}
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
                    onChange={(e) => handleChange(index, 'bookingTime', e.target.value)}
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
            className="w-full bg-[#4256a6] text-white py-3 rounded-lg hover:bg-[#2a3875] transition-all duration-300 font-poppins"
          >
            Confirmar Reservas
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default BookingForm;
