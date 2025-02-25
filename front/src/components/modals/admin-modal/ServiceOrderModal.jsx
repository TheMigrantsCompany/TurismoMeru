import React from "react";

const ServiceOrderModal = ({ order, onClose, onChangeStatus }) => {
  const handleStatusChange = (newStatus) => {
    onChangeStatus(newStatus);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white text-black p-6 rounded-lg max-w-lg w-full relative overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold mb-4 text-black">
          Detalles de la Orden de Servicio
        </h2>

        <div className="mb-4">
          <label className="block font-bold text-gray-800">Excursión:</label>
          <p>{order.excursionName}</p>
        </div>

        <div className="mb-4">
          <label className="block font-bold text-gray-800">Fecha:</label>
          <p>{order.date}</p>
        </div>

        <div className="mb-4">
          <label className="block font-bold text-gray-800">
            Número de Pasajeros:
          </label>
          <p>{order.passengers}</p>
        </div>

        <div className="flex justify-center space-x-4 mb-4">
          <button
            onClick={() => handleStatusChange("completed")}
            className={`p-2 rounded ${
              order.status === "completed"
                ? "bg-green-500 text-white"
                : "bg-gray-300"
            }`}
          >
            Completada
          </button>
          <button
            onClick={() => handleStatusChange("pending")}
            className={`p-2 rounded ${
              order.status === "pending"
                ? "bg-yellow-500 text-white"
                : "bg-gray-300"
            }`}
          >
            Pendiente
          </button>
        </div>

        <div className="flex justify-between">
          <button onClick={onClose} className="p-2 border rounded bg-gray-300">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceOrderModal;
