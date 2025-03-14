import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ExcursionModal = ({ excursion, onClose, onToggleActive, onUpdate }) => {
  const [excursionData, setExcursionData] = useState({
    ...excursion,
    title: excursion.title || "",
    description: excursion.description || "",
    price: excursion.price || 0,
    duration: excursion.duration || "",
    difficulty: excursion.difficulty || "",
    location: excursion.location || "",
    category: excursion.category || "",
    meetingPoint: excursion.meetingPoint || "",
    requirements: excursion.requirements || "",
    cancellationPolicy: excursion.cancellationPolicy || "",
    additionalEquipment: excursion.additionalEquipment || "",
    guides: excursion.guides || [],
    stock: excursion.stock || 0,
    active: excursion.active || false,
    photos: excursion.photos || [],
    availabilityDate: excursion.availabilityDate || [],
    discount: {
      seniorPercentage: excursion.discountForSeniors || 0,
      minorPercentage: excursion.discountForMinors || 0,
    },
    lockedStock: excursion.lockedStock || 0,
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [newAvailability, setNewAvailability] = useState({
    date: new Date(),
    time: new Date(),
    stock: 0,
  });
  const [newGuide, setNewGuide] = useState({
    name: "",
  });

  useEffect(() => {
    if (excursion.photos && excursion.photos.length > 0) {
      setImagePreviews(excursion.photos);
    }
  }, [excursion.photos]);

  useEffect(() => {
    if (excursion.availabilityDate && excursion.availabilityDate.length > 0) {
      setSelectedDates(
        excursion.availabilityDate.map((date) => ({
          date: date.date,
          time: date.time,
          stock: date.stock || 0,
        }))
      );
    }
  }, [excursion.availabilityDate]);

  const handleStatusChange = (active) => {
    onToggleActive(excursion.id_Service);
    setExcursionData((prevData) => ({ ...prevData, active }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExcursionData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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

  const handleRemoveImage = (index) => {
    setImagePreviews((prevPreviews) =>
      prevPreviews.filter((_, i) => i !== index)
    );
    setExcursionData((prevData) => ({
      ...prevData,
      photos: prevData.photos.filter((_, i) => i !== index),
    }));
  };

  const handleDateChange = (date) => {
    setNewAvailability((prev) => ({
      ...prev,
      date: date,
    }));
  };

  const handleTimeChange = (time) => {
    setNewAvailability((prev) => ({
      ...prev,
      time: time,
    }));
  };

  const handleStockChange = (e) => {
    setNewAvailability((prev) => ({
      ...prev,
      stock: Number(e.target.value),
    }));
  };

  const calculateTotalStock = (dates) => {
    return dates.reduce((total, date) => total + Number(date.stock), 0);
  };

  const handleAddAvailability = () => {
    const { date, time, stock } = newAvailability;

    if (!date || !time || stock <= 0) {
      alert("Debes seleccionar una fecha, una hora y un stock válido.");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      alert("No puedes seleccionar una fecha pasada.");
      return;
    }

    const formattedDate = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const formattedTime = `${String(time.getHours()).padStart(2, "0")}:${String(
      time.getMinutes()
    ).padStart(2, "0")}`;

    const newAvailabilityEntry = {
      date: formattedDate,
      time: formattedTime,
      stock: Number(stock),
    };

    const updatedDates = [...selectedDates, newAvailabilityEntry];
    const newTotalStock = calculateTotalStock(updatedDates);

    setSelectedDates(updatedDates);
    setExcursionData((prevData) => ({
      ...prevData,
      stock: newTotalStock,
      availabilityDate: updatedDates,
    }));

    setNewAvailability({
      date: new Date(),
      time: new Date(),
      stock: 0,
    });
  };

  const handleRemoveAvailability = (index) => {
    const updatedDates = selectedDates.filter((_, i) => i !== index);
    const newTotalStock = calculateTotalStock(updatedDates);

    setSelectedDates(updatedDates);
    setExcursionData((prevData) => ({
      ...prevData,
      stock: newTotalStock,
      availabilityDate: updatedDates,
    }));
  };

  const handleUpdateAvailabilityStock = (index, newStock) => {
    const updatedDates = selectedDates.map((date, i) =>
      i === index ? { ...date, stock: Number(newStock) } : date
    );
    const newTotalStock = calculateTotalStock(updatedDates);

    setSelectedDates(updatedDates);
    setExcursionData((prevData) => ({
      ...prevData,
      stock: newTotalStock,
      availabilityDate: updatedDates,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/service/id/${excursion.id_Service}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...excursionData,
            discountForMinors: excursionData.discount.minorPercentage,
            discountForSeniors: excursionData.discount.seniorPercentage,
            availabilityDate: excursionData.availabilityDate,
          }),
        }
      );
      if (!response.ok) throw new Error("Error al actualizar el servicio");
      const updatedExcursion = await response.json();
      console.log("Excursión actualizada:", updatedExcursion);
      onUpdate(updatedExcursion);
      onClose();
    } catch (error) {
      console.error(error);
      setFormErrors({
        general: "No se pudo actualizar el servicio. Intenta nuevamente.",
      });
    }
  };

  const handleDiscountChange = (type, value) => {
    setExcursionData((prev) => ({
      ...prev,
      discount: {
        ...prev.discount,
        [type]: value,
      },
    }));
  };

  const handleAddGuide = () => {
    if (!newGuide.name.trim()) {
      setFormErrors({
        ...formErrors,
        guides: "Por favor, ingresa el nombre del guía.",
      });
      return;
    }

    setFormErrors({
      ...formErrors,
      guides: undefined,
    });

    setExcursionData((prevData) => ({
      ...prevData,
      guides: [...prevData.guides, { name: newGuide.name }],
    }));

    setNewGuide({ name: "" });
  };

  const handleRemoveGuide = (index) => {
    const guidesToRemove = excursionData.guides.filter((_, i) => i !== index);
    setExcursionData((prevData) => ({
      ...prevData,
      guides: guidesToRemove,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000cc]">
      <div className="bg-[#f9f3e1] p-8 rounded-xl max-w-4xl w-full relative z-10 overflow-y-auto max-h-[90vh] shadow-xl">
        <h2 className="text-2xl font-bold text-[#4256a6] mb-6 font-poppins">
          Editar Excursión: {excursionData.title}
        </h2>

        <div className="grid grid-cols-2 gap-6">
          {/* Columna izquierda */}
          <div className="space-y-4">
            {/* Información básica */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-[#4256a6] mb-4 font-poppins">
                Información Básica
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#425a66] mb-2 font-poppins">
                    Nombre:
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={excursionData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-[#425a66]/20 focus:ring-2 focus:ring-[#4256a6] focus:border-transparent transition-all bg-white font-poppins text-[#425a66]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#425a66] mb-2 font-poppins">
                    Descripción:
                  </label>
                  <textarea
                    name="description"
                    value={excursionData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-[#425a66]/20 focus:ring-2 focus:ring-[#4256a6] focus:border-transparent transition-all bg-white font-poppins text-[#425a66] resize-none h-32"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#425a66] mb-2 font-poppins">
                    Duración:
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={excursionData.duration}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-[#425a66]/20 focus:ring-2 focus:ring-[#4256a6] focus:border-transparent transition-all bg-white font-poppins text-[#425a66]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#425a66] mb-2 font-poppins">
                    Dificultad:
                  </label>
                  <input
                    type="text"
                    name="difficulty"
                    value={excursionData.difficulty}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-[#425a66]/20 focus:ring-2 focus:ring-[#4256a6] focus:border-transparent transition-all bg-white font-poppins text-[#425a66]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#425a66] mb-2 font-poppins">
                    Ubicación:
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={excursionData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-[#425a66]/20 focus:ring-2 focus:ring-[#4256a6] focus:border-transparent transition-all bg-white font-poppins text-[#425a66]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#425a66] mb-2 font-poppins">
                    Stock Total:
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={excursionData.stock}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-[#425a66]/20 focus:ring-2 focus:ring-[#4256a6] focus:border-transparent transition-all bg-white font-poppins text-[#425a66]"
                  />
                </div>
              </div>
            </div>

            {/* Precios y descuentos */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-[#4256a6] mb-4 font-poppins">
                Precios y Descuentos
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#425a66] mb-2 font-poppins">
                    Precio:
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={excursionData.price}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-[#425a66]/20 focus:ring-2 focus:ring-[#4256a6] focus:border-transparent transition-all bg-white font-poppins text-[#425a66]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#425a66] mb-2 font-poppins">
                    Descuento para Jubilados (%):
                  </label>
                  <input
                    type="number"
                    name="discount.seniorPercentage"
                    value={excursionData.discount.seniorPercentage}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-[#425a66]/20 focus:ring-2 focus:ring-[#4256a6] focus:border-transparent transition-all bg-white font-poppins text-[#425a66]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#425a66] mb-2 font-poppins">
                    Descuento para Menores (%):
                  </label>
                  <input
                    type="number"
                    name="discount.minorPercentage"
                    value={excursionData.discount.minorPercentage}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-[#425a66]/20 focus:ring-2 focus:ring-[#4256a6] focus:border-transparent transition-all bg-white font-poppins text-[#425a66]"
                  />
                </div>
              </div>
            </div>

            {/* Información Adicional */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-[#4256a6] mb-4 font-poppins">
                Información Adicional
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#425a66] mb-2 font-poppins">
                    Categoría:
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={excursionData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-[#425a66]/20 focus:ring-2 focus:ring-[#4256a6] focus:border-transparent transition-all bg-white font-poppins text-[#425a66]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#425a66] mb-2 font-poppins">
                    Punto de Encuentro:
                  </label>
                  <input
                    type="text"
                    name="meetingPoint"
                    value={excursionData.meetingPoint}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-[#425a66]/20 focus:ring-2 focus:ring-[#4256a6] focus:border-transparent transition-all bg-white font-poppins text-[#425a66]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#425a66] mb-2 font-poppins">
                    Requisitos:
                  </label>
                  <textarea
                    name="requirements"
                    value={excursionData.requirements}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-[#425a66]/20 focus:ring-2 focus:ring-[#4256a6] focus:border-transparent transition-all bg-white font-poppins text-[#425a66] resize-none h-24"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#425a66] mb-2 font-poppins">
                    Política de Cancelación:
                  </label>
                  <textarea
                    name="cancellationPolicy"
                    value={excursionData.cancellationPolicy}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-[#425a66]/20 focus:ring-2 focus:ring-[#4256a6] focus:border-transparent transition-all bg-white font-poppins text-[#425a66] resize-none h-24"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#425a66] mb-2 font-poppins">
                    Equipo Adicional:
                  </label>
                  <textarea
                    name="additionalEquipment"
                    value={excursionData.additionalEquipment}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-[#425a66]/20 focus:ring-2 focus:ring-[#4256a6] focus:border-transparent transition-all bg-white font-poppins text-[#425a66] resize-none h-24"
                  />
                </div>
              </div>
            </div>

            {/* Guías */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-[#4256a6] mb-4 font-poppins">
                Guías
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#425a66] mb-2 font-poppins">
                    Nombre del Guía:
                  </label>
                  <input
                    type="text"
                    value={newGuide.name}
                    onChange={(e) => setNewGuide({ name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-[#425a66]/20 focus:ring-2 focus:ring-[#4256a6] focus:border-transparent transition-all bg-white font-poppins text-[#425a66]"
                  />
                </div>

                <button
                  onClick={handleAddGuide}
                  className="px-4 py-2 bg-[#4256a6] text-white rounded-lg hover:bg-[#334477] transition-colors font-poppins"
                >
                  Agregar Guía
                </button>

                {/* Lista de guías agregados */}
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-[#425a66] mb-2 font-poppins">
                    Guías Agregados:
                  </h4>
                  <ul className="space-y-2">
                    {excursionData.guides.map((guide, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center bg-gray-50 p-2 rounded-lg"
                      >
                        <span className="text-[#425a66] font-poppins">
                          {guide.name}
                        </span>
                        <button
                          onClick={() => handleRemoveGuide(index)}
                          className="text-red-500 hover:text-red-700 text-xs px-2 py-1 font-poppins"
                        >
                          Eliminar
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha */}
          <div className="space-y-4">
            {/* Galería de imágenes */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-[#4256a6] mb-4 font-poppins">
                Galería de Imágenes
              </h3>
              <button
                onClick={() => document.getElementById("edit-photos").click()}
                className="px-6 py-2 bg-[#4256a6] text-white rounded-lg hover:bg-[#334477] transition-colors font-poppins flex items-center justify-center gap-2 mb-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
                Agregar Fotos
              </button>
              <input
                id="edit-photos"
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <div className="grid grid-cols-3 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Excursión ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Disponibilidad */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-[#4256a6] mb-4 font-poppins">
                Disponibilidad
              </h3>
              <div className="mt-4">
                <label className="block text-sm font-medium text-[#425a66] mb-2 font-poppins">
                  Agregar Nueva Fecha:
                </label>

                <div className="relative mb-2">
                  <DatePicker
                    selected={newAvailability.date}
                    onChange={handleDateChange}
                    dateFormat="MMMM d, yyyy"
                    className="w-full px-4 py-2 rounded-lg border border-[#425a66]/20 focus:ring-2 focus:ring-[#4256a6] focus:border-transparent transition-all bg-white font-poppins text-[#425a66]"
                  />
                </div>

                <div className="relative mb-2">
                  <DatePicker
                    selected={newAvailability.time}
                    onChange={handleTimeChange}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Hora"
                    dateFormat="h:mm aa"
                    className="w-full px-4 py-2 rounded-lg border border-[#425a66]/20 focus:ring-2 focus:ring-[#4256a6] focus:border-transparent transition-all bg-white font-poppins text-[#425a66]"
                  />
                </div>

                <div className="relative mb-2">
                  <label className="block text-sm font-medium text-[#425a66] mb-2 font-poppins">
                    Stock Disponible:
                  </label>
                  <input
                    type="number"
                    value={newAvailability.stock || ""}
                    onChange={(e) =>
                      setNewAvailability({
                        ...newAvailability,
                        stock: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-[#425a66]/20 focus:ring-2 focus:ring-[#4256a6] focus:border-transparent transition-all bg-white font-poppins text-[#425a66]"
                    placeholder="Cantidad disponible"
                  />
                </div>

                <button
                  onClick={handleAddAvailability}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-poppins"
                >
                  Agregar Fecha
                </button>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-[#425a66] mb-2 font-poppins">
                  Fechas Agregadas:
                </label>
                <ul className="space-y-2">
                  {selectedDates.map((availability, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center bg-gray-50 p-2 rounded-lg"
                    >
                      <span className="text-black">
                        {availability.date} - {availability.time}
                      </span>
                      <div className="flex items-center gap-4">
                        <input
                          type="number"
                          value={availability.stock}
                          onChange={(e) =>
                            handleUpdateAvailabilityStock(index, e.target.value)
                          }
                          className="w-20 px-2 py-1 rounded border border-gray-300"
                          min="0"
                        />
                        <button
                          onClick={() => handleRemoveAvailability(index)}
                          className="text-red-500 hover:text-red-700 text-xs px-2 py-1"
                        >
                          Eliminar
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 text-right">
                  <span className="font-medium">
                    Stock Total: {excursionData.stock}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-between mt-8">
          <div className="flex gap-4">
            <button
              onClick={() => handleStatusChange(true)}
              className={`px-6 py-2 rounded-lg font-poppins transition-colors ${
                excursionData.active
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Activa
            </button>
            <button
              onClick={() => handleStatusChange(false)}
              className={`px-6 py-2 rounded-lg font-poppins transition-colors ${
                !excursionData.active
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Inactiva
            </button>
          </div>
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#f4925b] text-white rounded-lg hover:bg-[#d98248] transition-colors font-poppins"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-[#4256a6] text-white rounded-lg hover:bg-[#334477] transition-colors font-poppins"
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExcursionModal;
