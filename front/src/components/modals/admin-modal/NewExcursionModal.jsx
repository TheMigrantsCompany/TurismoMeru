import React, { useState } from 'react';

const NewExcursionModal = ({ onClose, onSave }) => {
  const [excursionData, setExcursionData] = useState({
    name: '',
    description: '',
    capacity: '',
    price: '',
    active: true
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExcursionData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (excursionData.name && excursionData.description && excursionData.capacity && excursionData.price) {
      onSave(excursionData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full relative z-10">
        <h2 className="text-xl font-semibold mb-4">Crear Nueva Excursión</h2>

        <div className="mb-4">
          <label className="block font-bold text-gray-800">Nombre de la Excursión:</label>
          <input
            type="text"
            name="name"
            value={excursionData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block font-bold text-gray-800">Descripción:</label>
          <input
            type="text"
            name="description"
            value={excursionData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block font-bold text-gray-800">Capacidad:</label>
          <input
            type="number"
            name="capacity"
            value={excursionData.capacity}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block font-bold text-gray-800">Precio:</label>
          <input
            type="number"
            name="price"
            value={excursionData.price}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="flex justify-between">
          <button onClick={onClose} className="p-2 border rounded bg-gray-300">Cancelar</button>
          <button onClick={handleSubmit} className="p-2 bg-blue-500 text-white rounded">Guardar</button>
        </div>
      </div>
    </div>
  );
};

export default NewExcursionModal;
