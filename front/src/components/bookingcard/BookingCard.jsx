import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../views/shopping-cart/CartContext";

const BookingCard = ({ id_Service, price }) => {
  const [excursion, setExcursion] = useState(null); // Guardar detalles de la excursión
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [quantities, setQuantities] = useState({
    adultos: 0,
    menores: 0,
    jubilados: 0,
  });
  const [totalPrice, setTotalPrice] = useState(0);

  const { addToCart } = useCart(); // Obtener la función para añadir al carrito desde el contexto.
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExcursionDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/service/id/${id_Service}`
        );
        setExcursion(response.data); // Guardar los detalles de la excursión
        const rawDates = response.data.availabilityDate || [];
        const dates = [...new Set(rawDates.map(date => new Date(date).toLocaleDateString()))];
        const times = [...new Set(rawDates.map(date => new Date(date).toLocaleTimeString()))];

        setAvailableDates(dates);
        setAvailableTimes(times);
      } catch (error) {
        console.error("Error al obtener detalles de la excursión:", error);
      }
    };

    fetchExcursionDetails();
  }, [id_Service]);

  useEffect(() => {
  if (excursion) {
    const total =
      excursion.price * quantities.adultos +
      excursion.price * 0.8 * quantities.menores +
      excursion.price * 0.7 * quantities.jubilados;
    setTotalPrice(total);
  }
}, [quantities, excursion]);

  const handleQuantityChange = (type, action) => {
    setQuantities((prev) => ({
      ...prev,
      [type]: action === "increment" ? prev[type] + 1 : Math.max(prev[type] - 1, 0),
    }));
  };

  const handleAddToCart = () => {
    if (!selectedDate || !selectedTime) {
      alert("Por favor selecciona una fecha y un horario.");
      return;
    }

    if (Object.values(quantities).every((quantity) => quantity === 0)) {
      alert("Debes seleccionar al menos una persona.");
      return;
    }

    const cartItem = {
      id_Service,
      title: excursion?.title || "Título no disponible",
      price,
      totalPrice,
      selectedDate,
      selectedTime,
      quantities: {
        adults: quantities.adultos,
        children: quantities.menores,
        seniors: quantities.jubilados,
      },
      photos: excursion?.photos || [], // Asegúrate de que sea un array
      stock: excursion?.stock || 0, // Agregar stock si es necesario
      duration: excursion?.duration || "No disponible",
    };

    addToCart(cartItem);
    navigate("/user/shopping-cart");
  };

  return (
    <div className="bg-red-600 text-white p-6 rounded-lg max-w-sm">
      {/* Fecha */}
      <div className="mb-4">
        <label className="block font-bold mb-2">Fecha de llegada</label>
        <select
          className="w-full p-2 rounded text-black"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        >
          <option value="">Seleccione una fecha</option>
          {availableDates.map((date, index) => (
            <option key={index} value={date}>
              {date}
            </option>
          ))}
        </select>
      </div>

      {/* Horario */}
      <div className="mb-4">
        <label className="block font-bold mb-2">Horario</label>
        <select
          className="w-full p-2 rounded text-black"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
        >
          <option value="">Seleccione un horario</option>
          {availableTimes.map((time, index) => (
            <option key={index} value={time}>
              {time}
            </option>
          ))}
        </select>
      </div>

      {/* Personas */}
      <div className="mb-4">
        <label className="block font-bold mb-2">Personas</label>
        {["adultos", "menores", "jubilados"].map((type) => (
          <div key={type} className="flex items-center justify-between mb-2">
            <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
            <div className="flex items-center space-x-2">
              <button
                className="bg-gray-700 px-2 rounded"
                onClick={() => handleQuantityChange(type, "decrement")}
              >
                -
              </button>
              <span>{quantities[type]}</span>
              <button
                className="bg-gray-700 px-2 rounded"
                onClick={() => handleQuantityChange(type, "increment")}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Botón de añadir */}
      <button
        className="bg-blue-800 w-full py-2 rounded mt-4"
        onClick={handleAddToCart}
      >
        Añadir al carrito
      </button>

      {/* Nota, precio base y precio total */}
      <p className="text-sm mt-4">
        Tarifas promocionales por compra anticipada hasta 72hs antes de la salida.
        No válidas en destino.
      </p>
      <p className="text-lg font-bold mt-2 text-center">Precio base: ${price}</p>
      <p className="text-lg font-bold mt-2 text-center">Precio total: ${totalPrice.toFixed(2)}</p>
    </div>
  );
};

export default BookingCard;
