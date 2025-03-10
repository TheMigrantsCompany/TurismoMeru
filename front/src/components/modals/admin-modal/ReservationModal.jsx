import React from "react";
import { Typography } from "@material-tailwind/react";

const ReservationModal = ({ reservation, onClose }) => {
  if (!reservation) return null;

  // Extraemos los datos de la reserva y la orden de servicio
  const serviceOrder = reservation.serviceOrder;
  const paymentInfo = serviceOrder?.paymentInformation?.[0];

  // Formatear fecha y hora
  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
          {/* Información General */}
          <section>
            <Typography variant="h6" className="text-[#4256a6] mb-2">
              Información General
            </Typography>
            <div className="bg-white p-4 rounded-lg space-y-2">
              <p className="text-gray-900">
                <strong>ID de Reserva:</strong>{" "}
                <span className="break-all">{reservation.id_Booking}</span>
              </p>
              <p className="text-gray-900">
                <strong>DNI del Pasajero:</strong> {reservation.DNI}
              </p>
              <p className="text-gray-900">
                <strong>Nombre del Pasajero:</strong>{" "}
                {reservation.passengerName}
              </p>
            </div>
          </section>

          {/* Información del Servicio */}
          <section>
            <Typography variant="h6" className="text-[#4256a6] mb-2">
              Detalles del Servicio
            </Typography>
            <div className="bg-white p-4 rounded-lg space-y-2">
              <p className="text-gray-900">
                <strong>Nombre del Servicio:</strong> {reservation.serviceTitle}
              </p>
              <p className="text-gray-900">
                <strong>Fecha y Hora:</strong> {reservation.dateTime}
              </p>
            </div>
          </section>

          {/* Detalles de Pasajeros */}
          <section>
            <Typography variant="h6" className="text-[#4256a6] mb-2">
              Detalles de Pasajeros
            </Typography>
            <div className="bg-white p-4 rounded-lg space-y-2">
              <p className="text-gray-900">
                <strong>Total de Pasajeros:</strong> {reservation.totalPeople}
              </p>
              {paymentInfo && (
                <>
                  <p className="text-gray-900">
                    <strong>Adultos:</strong> {paymentInfo.adults}
                  </p>
                  <p className="text-gray-900">
                    <strong>Menores:</strong> {paymentInfo.minors}
                  </p>
                  <p className="text-gray-900">
                    <strong>Jubilados:</strong> {paymentInfo.seniors}
                  </p>
                </>
              )}
            </div>
          </section>

          {/* Estado y Fechas */}
          <section>
            <Typography variant="h6" className="text-[#4256a6] mb-2">
              Estado y Fechas
            </Typography>
            <div className="bg-white p-4 rounded-lg space-y-2">
              <p className="text-gray-900">
                <strong>Estado:</strong>{" "}
                <span
                  className={`px-3 py-1 rounded-full ${
                    reservation.active
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {reservation.active ? "Activa" : "Inactiva"}
                </span>
              </p>
            </div>
          </section>

          {/* Información de Pago */}
          {serviceOrder && (
            <section>
              <Typography variant="h6" className="text-[#4256a6] mb-2">
                Detalles de Pago
              </Typography>
              <div className="bg-white p-4 rounded-lg space-y-2">
                <p className="text-gray-900">
                  <strong>Precio Total:</strong> ${reservation.totalPrice}
                </p>
                <p className="text-gray-900">
                  <strong>Estado de Pago:</strong> {serviceOrder.paymentStatus}
                </p>
                <p className="text-gray-900">
                  <strong>ID Orden de Servicio:</strong>{" "}
                  <span className="break-all">
                    {reservation.id_ServiceOrder}
                  </span>
                </p>
              </div>
            </section>
          )}
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

export default ReservationModal;
