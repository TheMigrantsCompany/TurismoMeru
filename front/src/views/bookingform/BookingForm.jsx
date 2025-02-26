import React, { useState } from 'react';
import axios from 'axios';
import { Input, Button } from '@material-tailwind/react';

const BookingForm = ({ userId, serviceId, serviceTitle, servicePrice, serviceOrderId }) => {
  const [attendees, setAttendees] = useState([{ dni: '', bookingDate: '', bookingTime: '' }]);

  const handleChange = (index, field, value) => {
    const updatedAttendees = [...attendees];
    updatedAttendees[index][field] = value;
    setAttendees(updatedAttendees);
  };

  const addAttendee = () => {
    setAttendees([...attendees, { dni: '', bookingDate: '', bookingTime: '' }]);
  };

  const removeAttendee = (index) => {
    if (attendees.length > 1) {
      setAttendees(attendees.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const quantity = attendees.length;
      const totalPrice = servicePrice * quantity;
      const lockedStock = quantity;
      
      const payload = {
        userId,
        id_ServiceOrder: serviceOrderId,
        paymentStatus: 'Paid',
        DNI: attendees[0]?.dni, // Usamos el DNI del primer asistente como referencia
        paymentInformation: attendees.map((attendee, i) => ({
          id_Service: serviceId,
          serviceTitle,
          seatNumber: i + 1,
          DNI_Personal: attendee.dni,
          dateTime: `${attendee.bookingDate} ${attendee.bookingTime}`,
          totalPeople: quantity,
          totalPrice,
          lockedStock,
          date: attendee.bookingDate,
          time: attendee.bookingTime,
        })),
      };
      
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/booking`, payload);
      console.log('Reserva creada:', response.data);
    } catch (error) {
      console.error('Error al crear la reserva:', error.response?.data || error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {attendees.map((attendee, index) => (
        <div key={index} className="flex flex-col gap-2 border p-4 rounded-lg">
          <Input
            type="text"
            label="DNI"
            value={attendee.dni}
            onChange={(e) => handleChange(index, 'dni', e.target.value)}
            required
          />
          <Input
            type="date"
            label="Fecha de Reserva"
            value={attendee.bookingDate}
            onChange={(e) => handleChange(index, 'bookingDate', e.target.value)}
            required
          />
          <Input
            type="time"
            label="Hora de Reserva"
            value={attendee.bookingTime}
            onChange={(e) => handleChange(index, 'bookingTime', e.target.value)}
            required
          />
          {index > 0 && (
            <Button color="red" onClick={() => removeAttendee(index)}>Eliminar</Button>
          )}
        </div>
      ))}
      <Button color="blue" onClick={addAttendee}>Añadir Asistente</Button>
      <Button type="submit" color="green">Reservar</Button>
    </form>
  );
};

export default BookingForm;
