import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ExcursionModal = ({ excursion, onClose, onToggleActive, onUpdate }) => {
  const [excursionData, setExcursionData] = useState({
    ...excursion,
    discount: {
      seniorPercentage:
        excursion?.discount?.seniorPercentage ??
        excursion?.discountForSeniors ??
        0,
      minorPercentage:
        excursion?.discount?.minorPercentage ??
        excursion?.discountForMinors ??
        0,
    },
    lockedStock: excursion?.lockedStock ?? 0,  
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

  useEffect(() => {
    if (excursion.photos) {
      setImagePreviews([...excursion.photos]);
    }
    if (excursion.availabilityDate) {
      const formattedDates = excursion.availabilityDate.map((item) => ({
        date: item.date, // Mantener la fecha como cadena
        time: item.time, // Mantener la hora como cadena
        stock: item.stock ?? 0,
      }));
  
      setSelectedDates(formattedDates);
    }
  }, [excursion]);

  useEffect(() => {
    if (excursion) {
      setExcursionData({
        ...excursion,
        discount: {
          seniorPercentage:
            excursion.discount?.seniorPercentage ??
            excursion.discountForSeniors ??
            0,
          minorPercentage:
            excursion.discount?.minorPercentage ??
            excursion.discountForMinors ??
            0,
        },
      });
    }
  }, [excursion]);

  const handleStatusChange = () => {
    const newActiveStatus = !excursionData.active;
    onToggleActive(excursion.id_Service);
    setExcursionData((prevData) => ({ ...prevData, active: newActiveStatus }));
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

  // Función para agregar una nueva disponibilidad
  const handleAddAvailability = () => {
    const { date, time, stock } = newAvailability;
  
    // Validación de datos
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
  
    // Formatear la fecha y la hora
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const formattedTime = `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}`;
  
    // Crear el nuevo objeto de disponibilidad con la fecha y hora seleccionadas
    const newAvailabilityEntry = {
      date: formattedDate,
      time: formattedTime,
      stock: Number(stock), // Asegúrate de que el stock sea un número
    };
  
    // Actualizar la lista de fechas seleccionadas
    setSelectedDates((prev) => [...prev, newAvailabilityEntry]);
  
    // Actualizar el stock global sumando el nuevo stock
    setExcursionData((prevData) => ({
      ...prevData,
      stock: prevData.stock + Number(stock), // Asegurarse de sumar el stock como número
      availabilityDate: [...prevData.availabilityDate, newAvailabilityEntry], // Agregar la nueva fecha y stock
    }));
  
    // Resetear el formulario de nueva disponibilidad
    setNewAvailability({
      date: new Date(),
      time: new Date(),
      stock: 0,
    });
  };

// Función para eliminar una disponibilidad
const handleRemoveAvailability = (index) => {
  const availabilityToRemove = selectedDates[index];

  // Actualizar el stock global restando el stock de la fecha eliminada
  setExcursionData((prevData) => ({
    ...prevData,
    stock: prevData.stock - availabilityToRemove.stock, // Restar el stock global
    availabilityDate: prevData.availabilityDate.filter((_, i) => i !== index), // Eliminar la fecha de la lista
  }));

  // Eliminar la fecha seleccionada de la lista
  setSelectedDates((prev) => prev.filter((_, i) => i !== index));
};


  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/service/id/${excursion.id_Service}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...excursionData,
            discountForMinors: excursionData.discount.minorPercentage,
            discountForSeniors: excursionData.discount.seniorPercentage,
            availabilityDate: excursionData.availabilityDate, // Solo se envían las fechas con su stock
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
        [type]: value, // Actualiza dinámicamente seniorPercentage o minorPercentage
      },
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 pointer-events-auto">
      <div className="bg-[#dac9aa] p-6 rounded-lg max-w-lg w-full relative z-10 overflow-y-auto max-h-[90vh] shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-[#152817]">Actualizar Excursión</h2>
  
        <div>
          <label className="block text-sm text-[#4256a6] font-medium mb-1">
            Nombre de la Excursión:
          </label>
          <input
            type="text"
            name="title"
            value={excursionData.title || ""}
            onChange={handleChange}
            className="w-full border border-[#4256a6] px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#f4925b] transition text-[#152817]"
          />
          {formErrors.title && (
            <p className="text-red-600 text-sm">{formErrors.title}</p>
          )}
        </div>
  
        <div>
          <label className="block text-sm text-[#4256a6] font-medium mb-1">
            Descripción:
          </label>
          <textarea
            name="description"
            value={excursionData.description}
            onChange={handleChange}
            className="w-full border border-[#4256a6] px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#f4925b] transition text-[#152817] resize-none h-28"
            rows="5"
            placeholder="Escribe una descripción detallada aquí..."
          ></textarea>
          {formErrors.description && (
            <p className="text-red-600 text-sm">{formErrors.description}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-600 font-medium mb-1">
            Precio:
          </label>
          <input
            type="number"
            name="price"
            value={excursionData.price}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-black"
          />
          {formErrors.price && (
            <p className="text-red-500 text-sm">{formErrors.price}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-600 font-medium mb-1">
            Descuento para Jubilados (%):
          </label>
          <input
            type="number"
            name="seniorPercentage"
            value={excursionData.discount.seniorPercentage}
            onChange={(e) =>
              handleDiscountChange(
                "seniorPercentage",
                parseFloat(e.target.value)
              )
            }
            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-black"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 font-medium mb-1">
            Descuento para Menores (%):
          </label>
          <input
            type="number"
            name="minorPercentage"
            value={excursionData.discount.minorPercentage}
            onChange={(e) =>
              handleDiscountChange(
                "minorPercentage",
                parseFloat(e.target.value)
              )
            }
            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-black"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 font-medium mb-1">
            Stock:
          </label>
          <input
            type="number"
            name="stock"
            value={excursionData.stock}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-black"
          />
          {formErrors.stock && (
            <p className="text-red-500 text-sm">{formErrors.stock}</p>
          )}
        </div>
        <div>
  <label className="block text-sm text-gray-600 font-medium mb-1">
    Stock Bloqueado:
  </label>
  <input
    type="number"
    name="lockedStock"
    value={excursionData.lockedStock || 0} // Asegúrate de que sea accesible en el estado
    onChange={handleChange}
    className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-black"
  />
  {formErrors.lockedStock && (
    <p className="text-red-500 text-sm">{formErrors.lockedStock}</p>
  )}
</div>
        <div>
          <label className="block text-sm text-gray-600 font-medium mb-1">
            Fotos:
          </label>
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
          <label className="block text-sm text-gray-600 font-medium mb-1">
            Duración:
          </label>
          <input
            type="text"
            name="duration"
            value={excursionData.duration}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-black"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 font-medium mb-1">
            Dificultad:
          </label>
          <input
            type="text"
            name="difficulty"
            value={excursionData.difficulty}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-black"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 font-medium mb-1">
            Ubicación:
          </label>
          <input
            type="text"
            name="location"
            value={excursionData.location}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-black"
          />
        </div>

        <div className="mt-4">
  <label className="block text-sm text-gray-600 font-medium mb-1">
    Agregar Nueva Fecha:
  </label>

  <div className="relative mb-2">
    <DatePicker
      selected={newAvailability.date}
      onChange={handleDateChange}
      dateFormat="MMMM d, yyyy"
      className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-black"
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
      className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-black"
    />
  </div>

  {/* Agregar campo para stock */}
  <div className="relative mb-2">
    <label className="block text-sm text-gray-600 font-medium mb-1">Stock Disponible:</label>
    <input
      type="number"
      value={newAvailability.stock || ''}
      onChange={(e) => setNewAvailability({ ...newAvailability, stock: e.target.value })}
      className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-black"
      placeholder="Cantidad disponible"
    />
  </div>

  <button
    onClick={handleAddAvailability}
    className="bg-blue-600 text-white px-2 py-2 text-xs rounded-md hover:bg-blue-700 transition"
  >
    Agregar Fecha
  </button>
</div>

{/* Fechas seleccionadas */}
<div className="mt-6">
  <label className="block text-sm text-gray-600 font-medium mb-1">
    Fechas Agregadas:
  </label>
  <ul className="space-y-2">
    {selectedDates.map((availability, index) => (
      <li key={index} className="flex justify-between items-center">
        <span className="text-black">{availability.date} - {availability.time} - Stock: {availability.stock}</span>
        <button
          onClick={() => handleRemoveAvailability(index)}
          className="text-red-500 hover:text-red-700 text-xs px-2 py-1"
        >
          Eliminar
        </button>
      </li>
    ))}
  </ul>
</div>


        <div>
          <label className="block text-sm text-gray-600 font-medium mb-1">
            Categoría:
          </label>
          <input
            type="text"
            name="category"
            value={excursionData.category}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-black"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 font-medium mb-1">
            Punto de Encuentro:
          </label>
          <input
            type="text"
            name="meetingPoint"
            value={excursionData.meetingPoint}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-black"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 font-medium mb-1">
            Requisitos:
          </label>
          <input
            type="text"
            name="requirements"
            value={excursionData.requirements}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-black"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 font-medium mb-1">
            Política de Cancelación:
          </label>
          <input
            type="text"
            name="cancellationPolicy"
            value={excursionData.cancellationPolicy}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-black"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 font-medium mb-1">
            Equipo Adicional:
          </label>
          <input
            type="text"
            name="additionalEquipment"
            value={excursionData.additionalEquipment}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-black"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 font-medium mb-1">
            Guías:
          </label>
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
            className={`p-2 rounded ${
              excursionData.active
                ? "bg-green-500 text-white"
                : "bg-gray-300 text-black"
            }`}
          >
            Activa
          </button>
          <button
            onClick={handleStatusChange}
            className={`p-2 rounded ${
              !excursionData.active
                ? "bg-red-500 text-white"
                : "bg-gray-300 text-black"
            }`}
          >
            Inactiva
          </button>
        </div>
        <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={handleSubmit}
          className="py-2 px-4 rounded-md bg-[#4256a6] text-white hover:bg-[#f4925b] transition font-medium"
        >
          Guardar
        </button>
        <button
          onClick={onClose}
          className="py-2 px-4 rounded-md bg-[#f4925b] text-white hover:bg-[#4256a6] transition font-medium"
        >
          Cancelar
        </button>
      </div>

      {formErrors.general && (
        <p className="text-red-600 text-sm mt-4">{formErrors.general}</p>
      )}
    </div>
  </div>
);
};

export default ExcursionModal;
