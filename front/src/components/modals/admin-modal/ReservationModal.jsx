import React, { useState } from "react";

const ReservationModal = ({ reservation, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    excursionDate: reservation.excursionDate,
    seats: reservation.seats,
    status: reservation.status,
  });
  const [selectedStatus, setSelectedStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setFormData({ ...formData, status });
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000cc] pointer-events-auto">
      <div className="bg-[#dac9aa] p-6 rounded-lg max-w-lg w-full relative z-10 overflow-y-auto max-h-[90vh] shadow-xl">
        <h2 className="text-2xl font-semibold text-[#4256a6] mb-6">
          Editar Reserva
        </h2>

        {/* Información de la reserva */}
        <div className="mb-4">
          <label className="block font-semibold text-[#152817]">
            Nombre del Pasajero:
          </label>
          <p className="text-[#4256a6]">{reservation.passengerName}</p>
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-[#152817]">
            Documento de Identidad:
          </label>
          <p className="text-[#4256a6]">{reservation.passengerId}</p>
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-[#152817]">
            Nombre de la Excursión:
          </label>
          <p className="text-[#4256a6]">{reservation.excursionName}</p>
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-[#152817]">
            Método de Pago:
          </label>
          <p className="text-[#4256a6]">{reservation.paymentMethod}</p>
        </div>

        <div className="mb-6">
          <label className="block font-semibold text-[#152817]">
            Total Abonado:
          </label>
          <p className="text-[#4256a6]">{reservation.totalPaid}</p>
        </div>

        {/* Campos editables */}
        <div className="mb-4">
          <label className="block text-[#152817] font-medium mb-2">
            Fecha de la Excursión:
          </label>
          <input
            type="date"
            name="excursionDate"
            value={formData.excursionDate}
            onChange={handleInputChange}
            className="w-full p-2 border rounded text-[#4256a6] border-[#4256a6]"
          />
        </div>

        <div className="mb-6">
          <label className="block text-[#152817] font-medium mb-2">
            Cantidad de Lugares:
          </label>
          <input
            type="number"
            name="seats"
            value={formData.seats}
            onChange={handleInputChange}
            className="w-full p-2 border rounded text-[#4256a6] border-[#4256a6]"
          />
        </div>

        {/* Botones para cambiar el estado */}
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => handleStatusChange("accepted")}
            className={`p-2 rounded-lg ${selectedStatus === "accepted"
                ? "bg-green-600 text-white"
                : "bg-[#dac9aa] text-[#152817] border border-[#152817]"
              } hover:bg-green-700 transition-all`}
          >
            Confirmada
          </button>
          <button
            onClick={() => handleStatusChange("pending")}
            className={`p-2 rounded-lg ${selectedStatus === "pending"
                ? "bg-yellow-500 text-white"
                : "bg-[#dac9aa] text-[#152817] border border-[#152817]"
              } hover:bg-yellow-600 transition-all`}
          >
            Pendiente
          </button>
          <button
            onClick={() => handleStatusChange("cancelled")}
            className={`p-2 rounded-lg ${selectedStatus === "cancelled"
                ? "bg-red-600 text-white"
                : "bg-[#dac9aa] text-[#152817] border border-[#152817]"
              } hover:bg-red-700 transition-all`}
          >
            Cancelada
          </button>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#f4925b] text-white hover:bg-[#d98248] transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="p-2 rounded-lg bg-[#4256a6] text-white hover:bg-[#364d73] transition-all"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationModal;
