import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createExcursion,
  getAllServices,
} from "../../../redux/actions/actions";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const NewExcursionModal = ({ onClose, onSave }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.excursion || {});

  const [excursionData, setExcursionData] = useState({
    title: "",
    description: "",
    price: 0,
    discountForMinors: 0,
    discountForSeniors: 0,
    duration: "",
    difficulty: "",
    location: "",
    category: "",
    meetingPoint: "",
    requirements: "",
    cancellationPolicy: "",
    additionalEquipment: "",
    guides: [],
    stock: 0,
    active: true,
    photos: [],
    availabilityDate: [],
  });

  const [formErrors, setFormErrors] = useState({});
  const [imagePreviews, setImagePreviews] = useState([]);
  const [availabilities, setAvailabilities] = useState([]);
  const [newAvailability, setNewAvailability] = useState({
    date: new Date(),
    time: new Date(),
    stock: 0,
  });
  const [newGuide, setNewGuide] = useState({ name: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExcursionData((prevData) => ({
      ...prevData,
      [name]:
        name === "price" ||
        name === "duration" ||
        name === "stock" ||
        name.includes("discount")
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

  const handleStockChange = (e) => {
    const { value } = e.target;
    setNewAvailability((prev) => ({
      ...prev,
      stock: Number(value),
    }));
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

    setAvailabilities((prev) => [...prev, newAvailabilityEntry]);

    const newStock =
      availabilities.reduce(
        (total, availability) => total + Number(availability.stock),
        0
      ) + Number(stock);

    setExcursionData((prevData) => ({
      ...prevData,
      stock: newStock,
      availabilityDate: [...prevData.availabilityDate, newAvailabilityEntry],
    }));

    setNewAvailability({
      date: new Date(),
      time: new Date(),
      stock: 0,
    });
  };

  const handleRemoveAvailability = (index) => {
    const removedAvailability = availabilities[index];

    setAvailabilities((prev) => {
      const newAvailabilities = prev.filter((_, i) => i !== index);
      const newStock = newAvailabilities.reduce(
        (total, availability) => total + Number(availability.stock),
        0
      );

      setExcursionData((prevData) => ({
        ...prevData,
        stock: newStock,
        availabilityDate: newAvailabilities,
      }));

      return newAvailabilities;
    });
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
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dzrnybyqo/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );
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
    if (!excursionData.description.trim())
      errors.description = "La descripción es obligatoria.";
    if (!excursionData.price || excursionData.price <= 0)
      errors.price = "El precio debe ser mayor a 0.";
    if (!excursionData.stock || excursionData.stock <= 0)
      errors.stock = "El stock debe ser mayor a 0.";
    if (!excursionData.photos.length)
      errors.photos = "Debes subir al menos una foto.";
    if (!availabilities.length)
      errors.availabilityDate = "Debes agregar al menos una fecha.";
    if (excursionData.guides.length === 0)
      errors.guides = "Debes agregar al menos un guía.";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    availabilities.forEach((availability, index) => {
      const selectedDate = new Date(availability.date);
      selectedDate.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        errors[`availabilityDate${index}`] =
          "No puedes agregar fechas pasadas.";
      }
    });

    return errors;
  };

  const handleSubmit = async () => {
    const errors = validateForm();
    console.log("Errores de validación:", errors); // Verifica errores

    if (Object.keys(errors).length) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    try {
      const excursionPayload = {
        ...excursionData,
        availabilityDate: availabilities,
      };

      console.log("Enviando datos:", excursionPayload);

      await dispatch(createExcursion(excursionPayload));
      dispatch(getAllServices());
      onSave();
    } catch (err) {
      console.error("Error al crear la excursión:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000cc]">
      <div className="bg-[#f9f3e1] p-8 rounded-xl max-w-4xl w-full relative z-10 overflow-y-auto max-h-[90vh] shadow-xl">
        <h2 className="text-2xl font-bold text-[#4256a6] mb-6 font-poppins">
          Crear Nueva Excursión
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
                    value={excursionData.stock}
                    disabled
                    className="w-full px-4 py-2 rounded-lg border border-[#425a66]/20 bg-gray-50 font-poppins text-[#425a66]"
                  />
                  <p className="text-xs text-[#425a66] mt-1 font-poppins">
                    *El stock total se calcula automáticamente según las fechas
                    agregadas
                  </p>
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
                    name="discountForSeniors"
                    value={excursionData.discountForSeniors}
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
                    name="discountForMinors"
                    value={excursionData.discountForMinors}
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
                onClick={() => document.getElementById("photo-upload").click()}
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
                Subir Fotos
              </button>
              <input
                id="photo-upload"
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
                  className="px-4 py-2 bg-[#4256a6] text-white rounded-lg hover:bg-[#334477] transition-colors font-poppins"
                >
                  Agregar Fecha
                </button>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-[#425a66] mb-2 font-poppins">
                  Fechas Agregadas:
                </label>
                <ul className="space-y-2">
                  {availabilities.map((availability, index) => {
                    const formattedDate = new Date(
                      availability.date
                    ).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    });

                    return (
                      <li
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <span className="text-[#425a66] font-poppins">
                          {formattedDate} - {availability.time} - Stock:{" "}
                          {availability.stock}
                        </span>
                        <button
                          onClick={() => handleRemoveAvailability(index)}
                          className="text-red-500 hover:text-red-700 text-xs px-2 py-1 font-poppins"
                        >
                          Eliminar
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-4 mt-8">
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
            Crear
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewExcursionModal;
