import React from "react";

const UserModal = ({ user, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full relative overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold mb-4 text-black">Detalles del Usuario</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">ID:</label>
          <p className="text-black">{user.id_User}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Nombre:</label>
          <p className="text-black">{user.name || "N/A"}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Email:</label>
          <p className="text-black">{user.email || "N/A"}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Rol:</label>
          <p className="text-black">{user.role || "N/A"}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">DNI:</label>
          <p className="text-black">{user.DNI || "N/A"}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Teléfono:</label>
          <p className="text-black">{user.phone || "N/A"}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Imagen:</label>
          {user.image ? (
            <img src={user.image} alt="Imagen de Usuario" className="w-20 h-20 rounded-full" />
          ) : (
            <p className="text-black">No disponible</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Dirección:</label>
          <p className="text-black">{user.address || "N/A"}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Carrito de Compras:</label>
          <p className="text-black">
            {user.shoppingCart ? JSON.stringify(user.shoppingCart) : "N/A"}
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Estado:</label>
          <p className="text-black">{user.active ? "Activo" : "Inactivo"}</p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
