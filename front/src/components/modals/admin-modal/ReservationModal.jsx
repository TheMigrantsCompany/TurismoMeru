import React from "react";

const ReservationModal = ({ reservation, onClose, onSave }) => {
  if (!reservation) return null;

  // Extraemos los datos de la reserva y la orden de servicio
  const serviceOrder = reservation.serviceOrder;
  const paymentInfo = serviceOrder?.paymentInformation?.[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000cc] pointer-events-auto">
      <div className="bg-[#dac9aa] p-6 rounded-lg max-w-lg w-full relative z-10 overflow-y-auto max-h-[90vh] shadow-xl">
        <h2 className="text-2xl font-semibold text-[#4256a6] mb-6">
          Detalles de la Reserva
        </h2>

        {/* Información de la reserva (booking) */}
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
          <p className="text-[#4256a6]">{reservation.DNI}</p>
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-[#152817]">
            Nombre del Servicio:
          </label>
          <p className="text-[#4256a6]">{reservation.serviceTitle}</p>
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-[#152817]">
            Fecha y Horario del Servicio:
          </label>
          <p className="text-[#4256a6]">{reservation.dateTime}</p>
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-[#152817]">
            Cantidad Total de Pasajeros:
          </label>
          <p className="text-[#4256a6]">{reservation.totalPeople}</p>
        </div>

        {/* Información adicional de la orden de servicio */}
        {serviceOrder && (
          <>
            <hr className="my-4" />
            <h3 className="text-xl font-semibold text-[#4256a6] mb-4">
              Detalles de la Orden de Servicio
            </h3>

            <div className="mb-4">
              <label className="block font-semibold text-[#152817]">
                ID Orden de Servicio:
              </label>
              <p className="text-[#4256a6]">{serviceOrder.id_ServiceOrder}</p>
            </div>

            <div className="mb-4">
              <label className="block font-semibold text-[#152817]">
                Estado de Pago:
              </label>
              <p className="text-[#4256a6]">{serviceOrder.paymentStatus}</p>
            </div>

            <div className="mb-4">
              <label className="block font-semibold text-[#152817]">
                Método de Pago:
              </label>
              <p className="text-[#4256a6]">{serviceOrder.paymentMethod}</p>
            </div>

            <div className="mb-4">
              <label className="block font-semibold text-[#152817]">
                Total:
              </label>
              <p className="text-[#4256a6]">${serviceOrder.total}</p>
            </div>

            {paymentInfo && (
              <div className="mb-4">
                <label className="block font-semibold text-[#152817]">
                  Cantidad de Pasajeros:
                </label>
                <p className="text-[#4256a6]">
                  Adultos: {paymentInfo.adults} | Menores: {paymentInfo.minors}{" "}
                  | Jubilados: {paymentInfo.seniors}
                </p>
              </div>
            )}
          </>
        )}

        {/* Botones */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="p-2 mr-2 rounded-lg bg-[#f4925b] text-white hover:bg-[#d98248] transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationModal;
