import React, { useState } from 'react';

const ReservationModal = ({ reservation, onClose, onSave }) => {
    const [formData, setFormData] = useState({
      excursionDate: reservation.excursionDate,
      seats: reservation.seats,
      status: reservation.status,
    });
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleStatusChange = (newStatus) => {
      setFormData({ ...formData, status: newStatus });
    };
  
    const handleSubmit = () => {
      onSave(formData); // Guardar los datos modificados
      onClose(); // Cerrar el modal
    };
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75 pointer-events-auto">
        <div className="bg-white p-6 rounded-lg max-w-lg w-full relative z-10">
          <h2 className="text-xl font-semibold mb-4">Editar Reserva</h2>
  
          {/* Mostrar toda la información relevante de la reserva */}
          <div className="mb-4">
            <label className="block font-bold">Nombre del Pasajero:</label>
            <p>{reservation.passengerName}</p>
          </div>
  
          <div className="mb-4">
            <label className="block font-bold">Documento de Identidad:</label>
            <p>{reservation.passengerId}</p>
          </div>
  
          <div className="mb-4">
            <label className="block font-bold">Nombre de la Excursión:</label>
            <p>{reservation.excursionName}</p>
          </div>
  
          <div className="mb-4">
            <label className="block font-bold">Método de Pago:</label>
            <p>{reservation.paymentMethod}</p>
          </div>
  
          <div className="mb-4">
            <label className="block font-bold">Total Abonado:</label>
            <p>{reservation.totalPaid}</p>
          </div>
  
          {/* Campos editables */}
          <div className="mb-4">
            <label className="block mb-2">Fecha de la Excursión:</label>
            <input
              type="date"
              name="excursionDate"
              value={formData.excursionDate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
  
          <div className="mb-4">
            <label className="block mb-2">Cantidad de Lugares:</label>
            <input
              type="number"
              name="seats"
              value={formData.seats}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
  
          {/* Botones para cambiar el estado */}
          <div className="mb-4">
            <label className="block font-bold">Estado de la Reserva:</label>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleStatusChange('pending')}
                className={`p-2 rounded ${formData.status === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
              >
                Pendiente
              </button>
              <button
                onClick={() => handleStatusChange('accepted')}
                className={`p-2 rounded ${formData.status === 'accepted' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
              >
                Aceptada
              </button>
              <button
                onClick={() => handleStatusChange('cancelled')}
                className={`p-2 rounded ${formData.status === 'cancelled' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
              >
                Cancelada
              </button>
            </div>
          </div>
  
          <div className="flex justify-end">
            <button onClick={onClose} className="mr-4 p-2 border rounded">Cerrar</button>
            <button onClick={handleSubmit} className="p-2 bg-blue-500 text-white rounded">Guardar</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default ReservationModal;