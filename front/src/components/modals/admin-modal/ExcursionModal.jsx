import React, { useState, useEffect } from 'react';

const ExcursionModal = ({ excursion, onClose, onToggleActive, onUpdate }) => {
  const [excursionData, setExcursionData] = useState({ ...excursion });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);

 
  useEffect(() => {
    if (excursion.photos) {
      setImagePreviews([...excursion.photos]);
    }
  }, [excursion.photos]);

  const handleStatusChange = () => {
    const newActiveStatus = !excursionData.active; 
    onToggleActive(excursion.id_Service); 
    setExcursionData((prevData) => ({ ...prevData, active: newActiveStatus })); 
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExcursionData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePhotoChange = async (e) => {
    const files = Array.from(e.target.files);
    setLoading(true);

    try {
      const uploadedPhotos = await Promise.all(
        files.map((file) => uploadPhotoToCloudinary(file))
      );

      const previews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews((prevPreviews) => [...prevPreviews, ...previews]);

      setExcursionData((prevData) => ({
        ...prevData,
        photos: [...prevData.photos, ...uploadedPhotos],
      }));
    } catch (error) {
      console.error("Error uploading photos:", error);
    } finally {
      setLoading(false);
    }
  };

  const uploadPhotoToCloudinary = (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "meruvyt");

    return fetch("https://api.cloudinary.com/v1_1/dzrnybyqo/image/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => data.secure_url)
      .catch((error) => {
        throw new Error("Error uploading image to Cloudinary");
      });
  };

  // Manejar eliminación de miniaturas
  const handleRemoveImage = (index) => {
    setImagePreviews((prevPreviews) =>
      prevPreviews.filter((_, i) => i !== index)
    );
    setExcursionData((prevData) => ({
      ...prevData,
      photos: prevData.photos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:3001/service/id/${excursion.id_Service}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(excursionData),
      });
      if (!response.ok) {
        throw new Error('Error al actualizar el servicio');
      }
      const updatedExcursion = await response.json();
      onUpdate(updatedExcursion);
      onClose();
    } catch (error) {
      console.error(error);
      setFormErrors({ general: 'No se pudo actualizar el servicio. Intenta nuevamente.' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75 pointer-events-auto">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full relative z-10 overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold mb-4 text-black">Actualizar Excursión</h2>

        <div>
          <label className="block text-sm text-gray-600 font-medium mb-1">Nombre de la Excursión:</label>
          <input
            type="text"
            name="title"
            value={excursionData.title || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-black"
          />
          {formErrors.title && <p className="text-red-500 text-sm">{formErrors.title}</p>}
        </div>
        
        <div>
          <label className="block text-sm text-gray-600 font-medium mb-1">Descripción:</label>
          <input
            type="text"
            name="description"
            value={excursionData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-black"
          />
          {formErrors.description && <p className="text-red-500 text-sm">{formErrors.description}</p>}
        </div>

        <div>
          <label className="block text-sm text-gray-600 font-medium mb-1">Precio:</label>
          <input
            type="number"
            name="price"
            value={excursionData.price}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-black"
          />
          {formErrors.price && <p className="text-red-500 text-sm">{formErrors.price}</p>}
        </div>

        <div>
          <label className="block text-sm text-gray-600 font-medium mb-1">Stock:</label>
          <input
            type="number"
            name="stock"
            value={excursionData.stock}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-black"
          />
          {formErrors.stock && <p className="text-red-500 text-sm">{formErrors.stock}</p>}
        </div>

        <div>
        <label className="block text-sm text-gray-600 font-medium mb-1">Fotos:</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handlePhotoChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-black"
          />
        </div>

        <div className="flex flex-wrap gap-4 mt-4">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative">
              <img
                src={preview}
                alt={`Preview ${index}`}
                className="w-20 h-20 object-cover rounded-md mb-2"
              />
              <button
        onClick={() => handleRemoveImage(index)}
        className="absolute top-1 right-1 bg-red-500 text-white text-sm rounded-full p-1 opacity-100 shadow-md transition-opacity duration-200"
        aria-label="Remove image"
      >
        ×
      </button>
            </div>
          ))}
        </div>
        <div>
          <label className="block text-sm text-gray-600 font-medium mb-1">Duración:</label>
          <input
            type="text"
            name="duration"
            value={excursionData.duration}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-black"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 font-medium mb-1">Dificultad:</label>
          <input
            type="text"
            name="difficulty"
            value={excursionData.difficulty}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-black"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 font-medium mb-1">Ubicación:</label>
          <input
            type="text"
            name="location"
            value={excursionData.location}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-black"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 font-medium mb-1">Fecha de Disponibilidad:</label>
          <input
            type="date"
            name="availabilityDate"
            value={excursionData.availabilityDate ? excursionData.availabilityDate.split("T")[0] : ""}
            onChange={handleChange}
             className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-black"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 font-medium mb-1">Categoría:</label>
          <input
            type="text"
            name="category"
            value={excursionData.category}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-black"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 font-medium mb-1">Punto de Encuentro:</label>
          <input
            type="text"
            name="meetingPoint"
            value={excursionData.meetingPoint}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-black"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 font-medium mb-1">Requisitos:</label>
          <input
            type="text"
            name="requirements"
            value={excursionData.requirements}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-black"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 font-medium mb-1">Política de Cancelación:</label>
          <input
            type="text"
            name="cancellationPolicy"
            value={excursionData.cancellationPolicy}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-black"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 font-medium mb-1">Equipo Adicional:</label>
          <input
            type="text"
            name="additionalEquipment"
            value={excursionData.additionalEquipment}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-black"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 font-medium mb-1">Guías:</label>
          <input
            type="text"
            name="guides"
            value={excursionData.guides}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-black"
          />
        </div>

        <div className="flex justify-center space-x-4 mb-4 mt-4">
          <button
            onClick={handleStatusChange}
            className={`p-2 rounded ${excursion.active ? 'bg-green-500 text-white' : 'bg-gray-300 text-black'}`}
          >
            Activa
          </button>
          <button
            onClick={handleStatusChange}
            className={`p-2 rounded ${!excursion.active ? 'bg-red-500 text-white' : 'bg-gray-300 text-black'}`}
          >
            Inactiva
          </button>
        </div>

        <div className="flex justify-between mt-4">
          <button onClick={handleSubmit} className={`py-2 px-4 rounded-md text-white ${excursionData.active ? 'bg-red-500' : 'bg-green-500'}`}>
            Guardar
          </button>
          <button onClick={onClose} className={`py-2 px-4 rounded-md text-white ${excursionData.active ? 'bg-red-500' : 'bg-green-500'}`}>
            Cancelar
          </button>
        </div>

        {formErrors.general && <p className="text-red-500 text-sm mt-2">{formErrors.general}</p>}
      </div>
    </div>
  );
};

export default ExcursionModal;