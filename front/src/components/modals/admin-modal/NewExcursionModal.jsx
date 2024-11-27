import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createExcursion, getAllServices } from "../../../redux/actions/actions";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const NewExcursionModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.excursion || {});

  const [excursionData, setExcursionData] = useState({
    title: '',
    description: '',
    price: 0,
    discountForMinors: 0,
    discountForSeniors: 0,
    duration: 0,
    difficulty: '',
    location: '',
    availabilityDate: [],
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
  const [imagePreviews, setImagePreviews] = useState([]);
  const [availabilities, setAvailabilities] = useState([]);
  const [newAvailability, setNewAvailability] = useState({
    date: new Date(),
    time: new Date(),
  });
  const [newGuide, setNewGuide] = useState({ name: '', experience: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExcursionData((prevData) => ({
      ...prevData,
      [name]: name === "price" || name === "duration" || name === "stock" || name.includes("discount")
        ? Number(value)
        : value,
    }));
  };

  const handleDateChange = (selectedDate) => {
    setNewAvailability((prev) => ({
      ...prev,
      date: selectedDate,
    }));
  };

  const handleAddGuide = () => {
    if (!newGuide.name.trim() || !newGuide.experience.trim()) {
      alert("Debes completar el nombre y la experiencia del guía.");
      return;
    }
    setExcursionData((prevData) => ({
      ...prevData,
      guides: [...prevData.guides, newGuide],
    }));
    setNewGuide({ name: '', experience: '' });
  };

  const handleRemoveGuide = (index) => {
    setExcursionData((prevData) => ({
      ...prevData,
      guides: prevData.guides.filter((_, i) => i !== index),
    }));
  };

  const handleTimeChange = (selectedTime) => {
    setNewAvailability((prev) => ({
      ...prev,
      time: selectedTime,
    }));
  };


  const handleAddAvailability = () => {
    const { date, time } = newAvailability;
    if (!date || !time) {
      alert("Debes seleccionar una fecha y una hora.");
      return;
    }

    const combinedDateTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes()
    ).toISOString();

    setAvailabilities((prev) => [...prev, combinedDateTime]);
    setNewAvailability({
      date: new Date(),
      time: new Date(),
    });
  };

  const handleRemoveAvailability = (index) => {
    setAvailabilities((prev) => prev.filter((_, i) => i !== index));
    setExcursionData((prevData) => ({
      ...prevData,
      availabilityDate: prevData.availabilityDate.filter((_, i) => i !== index),
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
          alert("Error al subir imagen a Cloudinary.");
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
    if (!excursionData.title.trim()) errors.title = "El nombre es obligatorio.";
    if (!excursionData.description.trim()) errors.description = "La descripción es obligatoria.";
    if (!excursionData.price || excursionData.price <= 0) errors.price = "El precio debe ser mayor a 0.";
    if (!excursionData.stock || excursionData.stock <= 0) errors.stock = "El stock debe ser mayor a 0.";
    if (!excursionData.photos.length) errors.photos = "Debes subir al menos una foto.";
    if (!availabilities.length) errors.availabilityDate = "Debes agregar al menos una fecha.";
    if (excursionData.guides.length === 0) errors.guides = "Debes agregar al menos un guía.";
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
      const excursionPayload = {
        ...excursionData,
        availabilityDate: availabilities.map((date) => new Date(date).toISOString()),
      };

      await dispatch(createExcursion(excursionPayload));
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
          {/* Nombre de la Excursión */}
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

          {/* Descripción */}
          <div>
            <label className="block text-sm text-gray-600 font-medium mb-1">Descripción:</label>
            <textarea
              name="description"
              value={excursionData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-black resize-none h-28"
              rows="5" 
              placeholder="Escribe una descripción detallada aquí..."
            ></textarea>
            {formErrors.description && <p className="text-red-500 text-sm">{formErrors.description}</p>}
          </div>

          {/* Precio */}
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
          {/* Descuentos */}
          <div>
            <label className="block text-sm text-gray-600 font-medium mb-1">Descuento para menores (%):</label>
            <input
              type="number"
              name="discountForMinors"
              value={excursionData.discountForMinors}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-black"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 font-medium mb-1">Descuento para mayores (%):</label>
            <input
              type="number"
              name="discountForSeniors"
              value={excursionData.discountForSeniors}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-black"
            />
          </div>

          {/* Stock */}
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

          {/* Fotos */}
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

          {/* Vista previa de imágenes */}
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

          {/* Duración */}
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

          {/* Dificultad */}
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

          {/* Ubicación */}
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

          {/* Fecha de Disponibilidad */}
          <div className="mt-4">

            <div className="mt-4">
              <label className="block text-sm text-gray-600 font-medium mb-1">Agregar Nueva Fecha:</label>

              {/* Selección de la fecha */}
              <div className="relative mb-2">
                <DatePicker
                  selected={newAvailability.date}
                  onChange={handleDateChange} // Actualiza solo la fecha
                  dateFormat="MMMM d, yyyy"
                  className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-black"
                />
              </div>

              {/* Selección de la hora */}
              <div className="relative mb-2">
                <DatePicker
                  selected={newAvailability.time}
                  onChange={handleTimeChange} // Actualiza solo la hora
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Hora"
                  dateFormat="h:mm aa"
                  className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-black"
                />
              </div>

              {/* Botón para agregar */}
              <button
                onClick={handleAddAvailability}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Agregar Fecha
              </button>
            </div>
          </div>

          {/* Fechas seleccionadas */}
          <div className="mt-6">
            <label className="block text-sm text-gray-600 font-medium mb-1">Fechas Agregadas:</label>
            <ul className="space-y-2">
              {availabilities.map((availability, index) => {
                const formattedDate = new Date(availability).toLocaleString("es-ES", {
                  weekday: "short",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });
                return (
                  <li key={index} className="flex justify-between items-center">
                    <span className="text-black">{formattedDate}</span>
                    <button
                      onClick={() => handleRemoveAvailability(index)}
                      className="text-red-500 hover:text-red-700 text-xs px-2 py-1"
                    >
                      Eliminar
                    </button>
                  </li>
                );
              })}
            </ul>

          </div>
        </div>

        {/* Categoría */}
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

        {/* Punto de Encuentro */}
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

        {/* Requisitos */}
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

        {/* Política de Cancelación */}
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

        {/* Equipo Adicional */}
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

        {/* Guías */}
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

        {/* Botones de Cancelar y Guardar */}
        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewExcursionModal;