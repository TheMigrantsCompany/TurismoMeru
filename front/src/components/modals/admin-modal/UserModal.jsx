import React, { useState } from 'react';

const UserModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...user });
  const [selectedStatus, setSelectedStatus] = useState(user.active ? 'active' : 'inactive');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setFormData({ ...formData, active: status === 'active' });
  };

  const handleSubmit = () => {
    onSave(formData); // Guardar los datos modificados
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75 pointer-events-auto">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full relative z-10 overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold mb-4 text-black">Editar Usuario</h2>

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

        {/* Campos editables */}
        <div className="mb-4">
          <label className="block mb-2 text-gray-800">Nuevo Nombre:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-gray-800">Nuevo Documento:</label>
          <input
            type="text"
            name="document"
            value={formData.document}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-gray-800">Nuevo Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
          />
        </div>

        {/* Botones para cambiar el estado del usuario */}
        <div className="flex justify-center space-x-4 mb-4">
          <button
            onClick={() => handleStatusChange('active')}
            className={`p-2 rounded ${selectedStatus === 'active' ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
          >
            Activo
          </button>
          <button
            onClick={() => handleStatusChange('inactive')}
            className={`p-2 rounded ${selectedStatus === 'inactive' ? 'bg-red-500 text-white' : 'bg-gray-300'}`}
          >
            Inactivo
          </button>
        </div>

        <div className="flex justify-between">
          <button onClick={onClose} className="p-2 border rounded bg-gray-300">Cancelar</button>
          <button onClick={handleSubmit} className="p-2 bg-blue-500 text-white rounded">Guardar</button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
