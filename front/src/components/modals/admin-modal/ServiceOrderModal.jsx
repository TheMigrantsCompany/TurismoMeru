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

  const handleStatusChange = async (newStatus) => {
    try {
      console.log(
        "Intentando actualizar orden:",
        order.id,
        "a estado:",
        newStatus
      );
      await dispatch(updateOrderStatus(order.id, newStatus));
      console.log("Orden actualizada exitosamente");
      await dispatch(getAllOrders());
      onClose();
    } catch (error) {
      console.error(
        "Error detallado al actualizar el estado:",
        error.response?.data || error.message
      );

      // Mostrar el error al usuario
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
          {/* Información de la excursión */}
          <section>
            <Typography variant="h6" className="text-[#4256a6] mb-2">
              Información de la Excursión
            </Typography>
            <div className="bg-white p-4 rounded-lg">
              <p className="text-gray-900">
                <strong>Excursión:</strong> {order.excursionName}
              </p>
              <p className="text-gray-900">
                <strong>Fecha:</strong> {order.date}
              </p>
              <p className="text-gray-900">
                <strong>Total de Pasajeros:</strong> {order.passengers}
              </p>
            </div>
          </section>

          {/* Estado de la orden */}
          <section>
            <Typography variant="h6" className="text-[#4256a6] mb-2">
              Estado de la Orden
            </Typography>
            <div className="bg-white p-4 rounded-lg">
              <p className="mb-4 text-gray-900">
                <strong>Estado Actual:</strong>{" "}
                <span
                  className={`px-3 py-1 rounded-full ${
                    order.status === "completed" ||
                    order.paymentStatus === "Pagado"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {order.status === "completed" ||
                  order.paymentStatus === "Pagado"
                    ? "Completada"
                    : "Pendiente"}
                </span>
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => handleStatusChange("completed")}
                  disabled={
                    updateStatus.loading || order.status === "completed"
                  }
                  className={`px-4 py-2 rounded-lg ${
                    order.status === "completed"
                      ? "bg-green-500 text-white cursor-not-allowed"
                      : "bg-green-100 text-green-600 hover:bg-green-500 hover:text-white"
                  } transition-colors ${
                    updateStatus.loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {updateStatus.loading
                    ? "Actualizando..."
                    : "Marcar como Completada"}
                </button>
                <button
                  onClick={() => handleStatusChange("pending")}
                  disabled={updateStatus.loading}
                  className={`px-4 py-2 rounded-lg ${
                    order.paymentStatus === "Pendiente"
                      ? "bg-yellow-500 text-white"
                      : "bg-yellow-100 text-yellow-600 hover:bg-yellow-500 hover:text-white"
                  } transition-colors ${
                    updateStatus.loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {updateStatus.loading
                    ? "Actualizando..."
                    : "Marcar como Pendiente"}
                </button>
              </div>

              {updateStatus.error && (
                <p className="text-red-500 mt-2">{updateStatus.error}</p>
              )}
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
