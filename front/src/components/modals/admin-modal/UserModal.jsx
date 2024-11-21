import React from "react";

const UserModal = ({ user, onClose, onToggleActive }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75 pointer-events-auto">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full relative z-10 overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold mb-4 text-black">Detalles del Usuario</h2>

        {/* Información básica del usuario */}
        <div className="mb-4">
          <label className="block font-bold text-gray-800">Nombre:</label>
          <p className="text-gray-800">{user.name}</p>
        </div>

        <div className="mb-4">
          <label className="block font-bold text-gray-800">Documento:</label>
          <p className="text-gray-800">{user.document}</p>
        </div>

        <div className="mb-4">
          <label className="block font-bold text-gray-800">Email:</label>
          <p className="text-gray-800">{user.email}</p>
        </div>

        {/* Mostrar excursiones contratadas */}
        <div className="mb-4">
          <label className="block font-bold text-gray-800">Excursiones Contratadas:</label>
          {user.excursions?.length > 0 ? (
            <ul className="list-disc list-inside">
              {user.excursions.map((excursion, index) => (
                <li key={index} className="text-gray-800">
                  {excursion.name} - {excursion.status}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-800">No tiene excursiones contratadas.</p>
          )}
        </div>

        {/* Botones para activar/desactivar */}
        <div className="flex justify-center space-x-4 mb-4">
          <button
            onClick={() => onToggleActive(user.id_User)}
            className={`p-2 rounded ${user.active ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
          >
            {user.active ? "Desactivar" : "Activar"}
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

export default UserModal;
