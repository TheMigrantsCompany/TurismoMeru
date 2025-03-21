import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../views/shopping-cart/CartContext";
import { AuthContext } from "../../firebase/AuthContext";
import Swal from "sweetalert2";

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
     bebes: 0,
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [currentStock, setCurrentStock] = useState(0);
  const [stockError, setStockError] = useState("");

  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { isUserActive } = useContext(AuthContext);

  useEffect(() => {
    const fetchExcursionDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/service/id/${id_Service}`
        );
        setExcursion(response.data);

        const rawDates = response.data.availabilityDate || [];
        const datesWithStock = rawDates.filter((item) => item.stock > 0);
        const uniqueDates = [
          ...new Set(datesWithStock.map((item) => item.date)),
        ];
        setAvailableDates(uniqueDates);
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
        excursion.price *
          (1 - (excursion.discountForMinors || 0) / 100) *
          quantities.menores +
        excursion.price *
          (1 - (excursion.discountForSeniors || 0) / 100) *
          quantities.jubilados;
      setTotalPrice(total);
    }
  }, [quantities, excursion]);

  useEffect(() => {
    if (selectedDate && selectedTime && excursion) {
      const selectedAvailability = excursion.availabilityDate.find(
        (item) => item.date === selectedDate && item.time === selectedTime
      );
      setCurrentStock(selectedAvailability?.stock || 0);
    }
  }, [selectedDate, selectedTime, excursion]);

  useEffect(() => {
    if (selectedDate && excursion) {
      const timesForDate = excursion.availabilityDate
        .filter((item) => item.date === selectedDate && item.stock > 0)
        .map((item) => item.time);
      setAvailableTimes(timesForDate);
    }
  }, [selectedDate, excursion]);

  useEffect(() => {
    const totalPersonas =
     quantities.adultos + quantities.menores + quantities.jubilados + quantities.bebes;

    if (totalPersonas > currentStock) {
      setStockError(
        "No hay lugares disponibles para la fecha y hora seleccionada"
      );
    } else {
      setStockError("");
    }
  }, [quantities, currentStock]);

  const handleQuantityChange = (type, action) => {
    setQuantities((prev) => ({
      ...prev,
      [type]:
        action === "increment" ? prev[type] + 1 : Math.max(prev[type] - 1, 0),
    }));
  };

  const handleAddToCart = () => {
    if (!isUserActive) {
      Swal.fire({
        title: "Acceso Denegado",
        text: "No tienes permiso para realizar esta acción",
        icon: "error",
        confirmButtonText: "Entendido",
      });
      return;
    }

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
        babies: quantities.bebes,
      },
      discountForMinors: excursion.discountForMinors,
      discountForSeniors: excursion.discountForSeniors,
      photos: excursion?.photos || [],
      stock: excursion?.stock || 0,
      duration: excursion?.duration || "No disponible",
    };

    addToCart(cartItem);
    navigate("/user/shopping-cart");
  };

  if (!isUserActive) {
    return null;
  }

  return (
    <div className="bg-[#dac9aa] text-[#152917] p-4 rounded-lg max-w-sm shadow-lg border-2 border-[#425a66]">
      <div className="mb-3">
        <label className="block text-sm font-bold">Fecha de llegada</label>
        <select
          className="w-full p-1 rounded text-[#152917] text-sm border border-[#425a66]"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setSelectedTime("");
            setStockError("");
          }}
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
          disabled={!selectedDate}
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
           { type: "adultos", label: "Adultos (+12 años)", description: "Mayores de 12 años" },
           { type: "menores", label: "Menores (3-11 años)", description: "Entre 3 y 11 años" },
           { type: "jubilados", label: "Jubilados (Argentina)", description: "Con credencial de jubilado" },
           { type: "bebes", label: "Bebés (0-2 años)", description: "Entre 0 y 2 años" },
       ].map(({ type, label, description }) => (
      <div
      key={type}
      className="flex items-center justify-between mb-2 text-sm"
       >
      <div className="flex flex-col">
        <span className="font-medium">{label}</span>
        <span className="text-xs text-gray-600">{description}</span>
      </div>
      <div className="flex items-center space-x-2">
        <button
          className="bg-[#f4a25b] px-2 rounded hover:bg-[#e8914a] transition-colors"
          onClick={() => handleQuantityChange(type, "decrement")}
        >
          -
        </button>
        <span className="min-w-[20px] text-center">{quantities[type]}</span>
        <button
          className="bg-[#f4a25b] px-2 rounded hover:bg-[#e8914a] transition-colors"
          onClick={() => handleQuantityChange(type, "increment")}
        >
          +
           </button>
          </div>
        </div>
       ))}
    </div>
      {stockError && (
        <p className="text-red-500 text-sm mt-2 mb-2">{stockError}</p>
      )}

      <button
        className={`bg-[#425a66] text-white w-full py-1 rounded text-sm hover:bg-[#152917] ${
          stockError ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={handleAddToCart}
        disabled={!!stockError}
      >
        Añadir al carrito
      </button>
      <p className="text-sm font-bold mt-2 text-[#152917]">
        Precio total: ${totalPrice.toFixed(2)}
      </p>
    </div>
  );
};

export default BookingCard;