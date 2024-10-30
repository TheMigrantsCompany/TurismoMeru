import React from 'react';

const ExcursionModal = ({ excursion, onClose, onToggleActive }) => {
  const handleStatusChange = () => {
    onToggleActive(excursion.id_Service); 
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75 pointer-events-auto">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full relative z-10 overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold mb-4 text-black">Detalles de la Excursión</h2>

        <div className="mb-4">
          <label className="block font-bold text-gray-800">Nombre:</label>
          <p className="text-gray-800">{excursion.name}</p>
        </div>

        <div className="mb-4">
          <label className="block font-bold text-gray-800">Descripción:</label>
          <p className="text-gray-800">{excursion.description}</p>
        </div>

        <div className="mb-4">
          <label className="block font-bold text-gray-800">Precio:</label>
          <p className="text-gray-800">{excursion.price}</p>
        </div>

        <div className="flex justify-center space-x-4 mb-4">
          <button
            onClick={handleStatusChange}
            className={`p-2 rounded ${excursion.active ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
          >
            Activa
          </button>
          <button
            onClick={handleStatusChange}
            className={`p-2 rounded ${!excursion.active ? 'bg-red-500 text-white' : 'bg-gray-300'}`}
          >
            Inactiva
          </button>
        </div>

        <div className="flex justify-between">
          <button onClick={onClose} className="p-2 border rounded bg-gray-300">Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default ExcursionModal;
