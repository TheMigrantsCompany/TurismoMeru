import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../views/shopping-cart/CartContext";

const BookingCard = ({ id_Service, price }) => {
  const [excursion, setExcursion] = useState(null);
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

  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExcursionDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/service/id/${id_Service}`
        );
        setExcursion(response.data);
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
  
    const minorDiscount = (100 - (excursion.discountForMinors || 0)) / 100;
    const seniorDiscount = (100 - (excursion.discountForSeniors || 0)) / 100;
  
    // Guardar descuentos individuales y precio por persona en el item del carrito
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
      childDiscount: excursion.discountForMinors,
      seniorDiscount: excursion.discountForSeniors,
      photos: excursion?.photos || [],
      stock: excursion?.stock || 0,
      duration: excursion?.duration || "No disponible",
    };
  
    addToCart(cartItem);
    navigate("/user/shopping-cart");
  
};
  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg max-w-xs shadow-lg">
      <div className="mb-3">
        <label className="block text-sm font-bold">Fecha de llegada</label>
        <select
          className="w-full p-1 rounded text-gray-800 text-sm"
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

      <div className="mb-3">
        <label className="block text-sm font-bold">Horario</label>
        <select
          className="w-full p-1 rounded text-gray-800 text-sm"
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

      <div className="mb-3">
        <label className="block text-sm font-bold">Personas</label>
        {["adultos", "menores", "jubilados"].map((type) => (
          <div key={type} className="flex items-center justify-between mb-1 text-sm">
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

      <button
        className="bg-blue-600 w-full py-1 rounded text-sm"
        onClick={handleAddToCart}
      >
        Añadir al carrito
      </button>

      <p className="text-xs mt-3">
        Promoción válida por compras 72 horas antes de la salida.
      </p>
      <p className="text-sm font-bold mt-2">Precio base: ${price}</p>
      <p className="text-sm font-bold mt-2">Precio total: ${totalPrice.toFixed(2)}</p>
    </div>
  );
};

export default BookingCard;