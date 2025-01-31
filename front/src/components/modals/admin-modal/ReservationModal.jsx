import React from "react";

const ReservationModal = ({ reservation, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000cc] pointer-events-auto">
      <div className="bg-[#dac9aa] p-6 rounded-lg max-w-lg w-full relative z-10 overflow-y-auto max-h-[90vh] shadow-xl">
        <h2 className="text-2xl font-semibold text-[#4256a6] mb-6">
          Detalles de la Reserva
        </h2>

        <div className="mb-4">
          <label className="block font-semibold text-[#152817]">Nombre del Pasajero:</label>
          <p className="text-[#4256a6]">{reservation.passengerName}</p>
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-[#152817]">Documento de Identidad:</label>
          <p className="text-[#4256a6]">{reservation.DNI}</p>
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-[#152817]">Nombre del Servicio:</label>
          <p className="text-[#4256a6]">{reservation.serviceTitle}</p>
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-[#152817]">Fecha y Horario del Servicio:</label>
          <p className="text-[#4256a6]">{reservation.dateTime}</p>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#f4925b] text-white hover:bg-[#d98248] transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationModal;
