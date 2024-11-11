import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createExcursion, getAllServices } from "../../../redux/actions/actions";

const NewExcursionModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.excursion || {});

  const [excursionData, setExcursionData] = useState({
    title: '',
    description: '',
    price: 0,
    duration: 0,
    difficulty: '',
    location: '',
    availabilityDate: '',
    photos: [],
    category: '',
    meetingPoint: '',
    requirements: '',
    cancellationPolicy: '',
    additionalEquipment: '',
    guides: [],
    stock: 0,
    active: true,
  });

  const [formErrors, setFormErrors] = useState({});
  const [imagePreviews, setImagePreviews] = useState([]); // Estado para miniaturas

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExcursionData((prevData) => ({
      ...prevData,
      [name]: name === "price" || name === "duration" || name === "stock" ? Number(value) : value,
    }));
  };

  const handlePhotoChange = async (e) => {
    const files = Array.from(e.target.files);
    const uploadedUrls = [];
    const previews = []; 

    for (const file of files) {
      const previewUrl = URL.createObjectURL(file);
      previews.push(previewUrl);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "meruvyt");

      try {
        const response = await fetch("https://api.cloudinary.com/v1_1/dzrnybyqo/image/upload", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        if (data.secure_url) {
          uploadedUrls.push(data.secure_url);
        } else {
          console.error("Error en la subida de Cloudinary:", data);
        }
      } catch (error) {
        console.error("Error al subir la imagen:", error);
      }
    }

    setExcursionData((prevState) => ({
      ...prevState,
      photos: [...prevState.photos, ...uploadedUrls],
    }));
    setImagePreviews((prevPreviews) => [...prevPreviews, ...previews]);
  };

  const validateForm = () => {
    const errors = {};

    if (!excursionData.title) errors.title = 'El nombre es obligatorio';
    if (!excursionData.description) errors.description = 'La descripción es obligatoria';
    if (!excursionData.price) errors.price = 'El precio es obligatorio';
    if (!excursionData.stock && excursionData.stock !== 0) errors.stock = 'El stock es obligatorio';
    if (!excursionData.photos.length) {
      console.error("No se han cargado fotos correctamente en Cloudinary");
      return;
    }
    return errors;
  };

  const handleSubmit = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    try {
      await dispatch(createExcursion(excursionData));
      dispatch(getAllServices());
      onClose();
    } catch (err) {
      console.error("Error al crear la excursión:", err);
    }
  };

  return (

 <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
  <div className="bg-white p-8 rounded-lg max-w-md w-full relative z-10 overflow-y-auto max-h-[90vh] shadow-lg">
    <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Crear Nueva Excursión</h2>
    

        {loading && <p className="text-center text-blue-500">Guardando...</p>}
        {error && <p className="text-center text-red-500">Error: {error}</p>}

        <div className="space-y-4">
          
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
           <img
             key={index}
              src={preview}
              alt={`Preview ${index}`}
               className="w-20 h-20 object-cover rounded-md mb-2"
           />
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
              value={excursionData.availabilityDate}
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
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition">Cancelar</button>
          <button onClick={handleSubmit} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewExcursionModal;