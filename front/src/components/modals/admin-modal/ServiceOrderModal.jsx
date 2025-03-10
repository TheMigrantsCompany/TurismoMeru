import React, { useEffect } from "react";
import { Typography } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrders,
  updateOrderStatus,
} from "../../../redux/actions/actions";
import Swal from "sweetalert2";

const ServiceOrderModal = ({ order, onClose }) => {
  const dispatch = useDispatch();
  const { updateStatus } = useSelector((state) => state.orders);

  console.log("Orden recibida en el modal:", order);
  console.log("ID de la orden:", order?.id_ServiceOrder);

  const handleStatusChange = async () => {
    try {
      if (!order?.id_ServiceOrder) {
        console.error("No hay ID de orden válido:", order);
        Swal.fire({
          title: "Error",
          text: "No se pudo identificar la orden",
          icon: "error",
          confirmButtonColor: "#4256a6",
          background: "#f9f3e1",
        });
        return;
      }

      console.log("Intentando actualizar orden con ID:", order.id_ServiceOrder);
      await dispatch(updateOrderStatus(order.id_ServiceOrder, "Pagado"));

      console.log("Orden actualizada exitosamente");
      await dispatch(getAllOrders());
      onClose();
    } catch (error) {
      console.error("Error completo:", error);
      console.error("Respuesta del backend:", error.response?.data);

      Swal.fire({
        title: "Error al actualizar estado",
        text:
          error.response?.data?.error ||
          "No se pudo actualizar el estado de la orden",
        icon: "error",
        confirmButtonColor: "#4256a6",
        background: "#f9f3e1",
      });
    }
  };

  // Verificar que la orden tiene toda la información necesaria
  useEffect(() => {
    console.log("Orden recibida en el modal:", order);
  }, [order]);

  // Verificar el estado actual del botón
  useEffect(() => {
    console.log("Estado actual de la orden:", {
      id: order.id,
      status: order.status,
      paymentStatus: order.paymentStatus,
    });
  }, [order]);

  useEffect(() => {
    console.log("Orden completa recibida en el modal:", order);
    console.log("Estado de pago:", order.paymentStatus);
    console.log("Información de pago:", order.paymentInformation);
  }, [order]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#f9f3e1] rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <Typography variant="h4" className="text-[#4256a6]">
            Detalle de la Orden de Servicio
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
                <strong>ID de Orden:</strong> {order.id}
              </p>
              <p className="text-gray-900">
                <strong>ID de Usuario:</strong> {order.id_User}
              </p>
              <p className="text-gray-900">
                <strong>Excursión:</strong>{" "}
                {order.paymentInformation?.[0]?.title || "Sin título"}
              </p>
            </div>
          </section>

          {/* Detalles de Pasajeros */}
          <section>
            <Typography variant="h6" className="text-[#4256a6] mb-2">
              Detalles de Pasajeros
            </Typography>
            <div className="bg-white p-4 rounded-lg space-y-2">
              {order.paymentInformation?.[0]?.DNI && (
                <p className="text-gray-900">
                  <strong>DNI:</strong> {order.paymentInformation[0].DNI}
                </p>
              )}
              <p className="text-gray-900">
                <strong>Total de Pasajeros:</strong>{" "}
                {(order.paymentInformation?.[0]?.adults || 0) +
                  (order.paymentInformation?.[0]?.minors || 0) +
                  (order.paymentInformation?.[0]?.seniors || 0)}
              </p>
              <div className="ml-4">
                <p className="text-gray-900">
                  <strong>Adultos:</strong>{" "}
                  {order.paymentInformation?.[0]?.adults || 0}
                </p>
                <p className="text-gray-900">
                  <strong>Menores:</strong>{" "}
                  {order.paymentInformation?.[0]?.minors || 0}
                </p>
                <p className="text-gray-900">
                  <strong>Jubilados:</strong>{" "}
                  {order.paymentInformation?.[0]?.seniors || 0}
                </p>
              </div>
            </div>
          </section>

          {/* Estado y Pago */}
          <section>
            <Typography variant="h6" className="text-[#4256a6] mb-2">
              Estado y Pago
            </Typography>
            <div className="bg-white p-4 rounded-lg space-y-2">
              <p className="text-gray-900">
                <strong>Estado de Pago:</strong>{" "}
                <span
                  className={`px-3 py-1 rounded-full ${
                    order.Bookings?.length > 0 ||
                    order.paymentStatus === "Pagado"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {order.Bookings?.length > 0 ? "Pagado" : order.paymentStatus}
                </span>
              </p>
              <p className="text-gray-900">
                <strong>Precio Total:</strong> $
                {order.paymentInformation?.[0]?.totalPrice || 0}
              </p>
              {order.paymentInformation?.[0]?.lockedStock && (
                <p className="text-gray-900">
                  <strong>Stock Reservado:</strong>{" "}
                  {order.paymentInformation[0].lockedStock}
                </p>
              )}
              {/* Botones de estado */}
              <div className="flex gap-4 mt-4">
                <button
                  onClick={handleStatusChange}
                  disabled={
                    updateStatus.loading ||
                    order.paymentStatus === "Pagado" ||
                    order.hasBooking
                  }
                  className={`px-4 py-2 rounded-lg ${
                    order.hasBooking || order.paymentStatus === "Pagado"
                      ? "bg-green-500 text-white cursor-not-allowed"
                      : "bg-green-100 text-green-600 hover:bg-green-500 hover:text-white"
                  } transition-colors ${
                    updateStatus.loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {order.hasBooking
                    ? "Reserva ya confirmada"
                    : updateStatus.loading
                    ? "Actualizando..."
                    : "Marcar como Completada"}
                </button>
              </div>
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

export default ServiceOrderModal;
