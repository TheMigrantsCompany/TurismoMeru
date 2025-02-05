import React, { useState } from 'react';
import axios from 'axios';

const BookingForm = ({ serviceId, quantity, serviceTitle, userId }) => {
  const [attendees, setAttendees] = useState(
    Array.from({ length: quantity }, () => ({ name: '', dni: '' }))
  );

  const handleChange = (index, field, value) => {
    const updatedAttendees = [...attendees];
    updatedAttendees[index][field] = value;
    setAttendees(updatedAttendees);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://bearing-settled-consult-je.trycloudflare.com/booking', {
        userId,
        paymentStatus: 'Paid',
        paymentInformation: attendees.map((attendee, i) => ({
          ServiceId: serviceId,
          serviceTitle,
          seatNumber: i + 1, 
          DNI_Personal: attendee.dni,
        })),
      });

      console.log('Reservas creadas:', response.data);
      alert('Reservas creadas con éxito');
    } catch (error) {
      console.error('Error al crear reservas:', error);
      alert('Hubo un problema al crear las reservas.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Formulario de Reserva</h2>
      {attendees.map((attendee, index) => (
        <div key={index}>
          <h3>Asistente {index + 1}</h3>
          <input
            type="text"
            placeholder="Nombre"
            value={attendee.name}
            onChange={(e) => handleChange(index, 'name', e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="DNI"
            value={attendee.dni}
            onChange={(e) => handleChange(index, 'dni', e.target.value)}
            required
          />
        </div>
      ))}
      <button type="submit">Enviar Reservas</button>
    </form>
  );
};

export default BookingForm;