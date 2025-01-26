import React from "react";

const UserModal = ({ user, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000cc] pointer-events-auto">
      <div className="bg-[#dac9aa] p-6 rounded-lg max-w-lg w-full relative overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold mb-4 text-[#d98248]">Detalles del Usuario</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#d98248]">ID:</label>
          <p className="text-[#4256a6]">{user.id_User}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-[#d98248]">Nombre:</label>
          <p className="text-[#4256a6]">{user.name || "N/A"}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-[#d98248]">Email:</label>
          <p className="text-[#4256a6]">{user.email || "N/A"}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-[#d98248]">Rol:</label>
          <p className="text-[#4256a6]">{user.role || "N/A"}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-[#d98248]">DNI:</label>
          <p className="text-[#4256a6]">{user.DNI || "N/A"}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-[#d98248]">Teléfono:</label>
          <p className="text-[#4256a6]">{user.phone || "N/A"}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-[#d98248]">Imagen:</label>
          {user.image ? (
            <img src={user.image} alt="Imagen de Usuario" className="w-20 h-20 rounded-full" />
          ) : (
            <p className="text-[#4256a6]">No disponible</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-[#d98248]">Dirección:</label>
          <p className="text-[#4256a6]">{user.address || "N/A"}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-[#d98248]">Carrito de Compras:</label>
          <p className="text-[#4256a6]">
            {user.shoppingCart ? JSON.stringify(user.shoppingCart) : "N/A"}
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-[#d98248]">Estado:</label>
          <p className="text-[#4256a6]">{user.active ? "Activo" : "Inactivo"}</p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#4256a6] text-white rounded hover:bg-[#364d73] transition"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
