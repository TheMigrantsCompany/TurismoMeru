import React from "react";
import { Typography } from "@material-tailwind/react";

const ReservationDetailModal = ({ reservation, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#f9f3e1] rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <Typography variant="h4" className="text-[#4256a6]">
            Detalle de la Reserva
          </Typography>
          <button
            onClick={onClose}
            className="text-[#4256a6] hover:text-[#2a3875]"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Información del servicio */}
          <section>
            <Typography variant="h6" className="text-[#4256a6] mb-2">
              Información del Servicio
            </Typography>
            <div className="bg-white p-4 rounded-lg">
              <p><strong>Servicio:</strong> {reservation.Service?.title}</p>
              <p><strong>Fecha:</strong> {reservation.date}</p>
              <p><strong>Hora:</strong> {reservation.time}</p>
              <p><strong>Precio Total:</strong> ${reservation.totalPrice}</p>
            </div>
          </section>

          {/* Información del pasajero */}
          <section>
            <Typography variant="h6" className="text-[#4256a6] mb-2">
              Información del Pasajero
            </Typography>
            <div className="bg-white p-4 rounded-lg">
              <p><strong>Nombre:</strong> {reservation.User?.name}</p>
              <p><strong>Email:</strong> {reservation.User?.email}</p>
              <p><strong>Teléfono:</strong> {reservation.User?.phone}</p>
            </div>
          </section>

          {/* Detalles de la reserva */}
          <section>
            <Typography variant="h6" className="text-[#4256a6] mb-2">
              Detalles de Pasajeros
            </Typography>
            <div className="bg-white p-4 rounded-lg">
              <p><strong>Adultos:</strong> {reservation.quantities?.adults}</p>
              <p><strong>Niños:</strong> {reservation.quantities?.children}</p>
              <p><strong>Adultos Mayores:</strong> {reservation.quantities?.seniors}</p>
            </div>
          </section>

          {/* Estado de la reserva */}
          <section>
            <Typography variant="h6" className="text-[#4256a6] mb-2">
              Estado de la Reserva
            </Typography>
            <div className="bg-white p-4 rounded-lg">
              <p><strong>Estado:</strong> {reservation.status}</p>
              <p><strong>Fecha de Reserva:</strong> {new Date(reservation.createdAt).toLocaleDateString()}</p>
            </div>
          </section>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#4256a6] text-white px-4 py-2 rounded hover:bg-[#2a3875] transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetailModal; 