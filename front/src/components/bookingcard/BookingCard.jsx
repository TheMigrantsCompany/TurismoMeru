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

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const datesWithStock = rawDates.filter((item) => {
          const itemDate = new Date(item.date + "T00:00:00");
          const isAfterToday = itemDate.getTime() > today.getTime();
          return item.stock > 0 && isAfterToday;
        });

        const uniqueDates = [
          ...new Set(datesWithStock.map((item) => item.date)),
        ];
        uniqueDates.sort((a, b) => new Date(a) - new Date(b));
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
      quantities.adultos +
      quantities.menores +
      quantities.jubilados +
      quantities.bebes;

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
      {/* Contenido del componente */}
    </div>
  );
};

export default BookingCard;
