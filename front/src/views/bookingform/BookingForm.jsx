import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../firebase/AuthContext";

const BookingForm = ({ serviceOrder }) => {
  const navigate = useNavigate();
  const { authToken, user } = useContext(AuthContext);
  const [bookingData, setBookingData] = useState({
    id_ServiceOrder: serviceOrder?.id_ServiceOrder || "",
    passengers: []
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!serviceOrder) {
      console.error("No se recibió una orden de servicio válida");
      setError("Error al obtener la orden de servicio");
    }
  }, [serviceOrder]);

  const handleChange = (index, field, value) => {
    const updatedPassengers = [...bookingData.passengers];
    updatedPassengers[index] = {
      ...updatedPassengers[index],
      [field]: value
    };
    setBookingData({ ...bookingData, passengers: updatedPassengers });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      console.log("Enviando datos de reserva:", JSON.stringify(bookingData, null, 2));
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/booking`,
        bookingData,
        {
          headers: {
            "Authorization": `Bearer ${authToken}`,
            "Content-Type": "application/json"
          }
        }
      );
      console.log("Reserva creada con éxito:", response.data);
      navigate("/user/purchases");
    } catch (error) {
      console.error("Error al crear la reserva:", error.response?.data || error.message);
      setError("Hubo un error al procesar la reserva. Inténtalo nuevamente.");
    }
  };

  return (
    <div>
      <h2>Formulario de Reserva</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        {serviceOrder?.items?.map((item, index) => (
          <div key={index}>
            <h3>Pasajero {index + 1}</h3>
            <input
              type="text"
              placeholder="Nombre"
              onChange={(e) => handleChange(index, "name", e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Apellido"
              onChange={(e) => handleChange(index, "surname", e.target.value)}
              required
            />
            <input
              type="date"
              placeholder="Fecha de nacimiento"
              onChange={(e) => handleChange(index, "birthdate", e.target.value)}
              required
            />
          </div>
        ))}
        <button type="submit">Confirmar Reserva</button>
      </form>
    </div>
  );
};

export default BookingForm;
