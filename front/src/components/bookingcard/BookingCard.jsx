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
    <div
    className="bg-[#dac9aa] text-[#152917] p-4 rounded-lg max-w-sm shadow-lg border-2 border-[#425a66]"
    style={{ fontFamily: "Arial, sans-serif" }}
  >
    <div className="mb-3">
      <label className="block text-sm font-bold">Fecha de llegada</label>
      <select
        className="w-full p-1 rounded text-[#152917] text-sm border border-[#425a66]"
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
        className="w-full p-1 rounded text-[#152917] text-sm border border-[#425a66]"
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
      {[
        { type: "adultos", label: "Adultos" },
        { type: "menores", label: "Menores" },
        { type: "jubilados", label: "Jubilados" },
      ].map(({ type, label }) => (
        <div key={type} className="flex items-center justify-between mb-1 text-sm">
          <span>{label}</span>
          <div className="flex items-center space-x-2">
            <button
              className="bg-[#f4a25b] px-2 rounded"
              onClick={() => handleQuantityChange(type, "decrement")}
            >
              -
            </button>
            <span>{quantities[type]}</span>
            <button
              className="bg-[#f4a25b] px-2 rounded"
              onClick={() => handleQuantityChange(type, "increment")}
            >
              +
            </button>
          </div>
        </div>
      ))}
    </div>

    <button
      className="bg-[#425a66] text-white w-full py-1 rounded text-sm hover:bg-[#152917]"
      onClick={handleAddToCart}
    >
      Añadir al carrito
    </button>

    <p className="text-xs mt-3 text-[#152917]">
      Promoción válida por compras 72 horas antes de la salida.
    </p>
    <p className="text-sm font-bold mt-2 text-[#152917]">Precio base: ${price}</p>
    <p className="text-sm font-bold mt-2 text-[#152917]">Precio total: ${totalPrice.toFixed(2)}</p>
  </div>
);

};

export default BookingCard;
