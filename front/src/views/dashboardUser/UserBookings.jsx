import React, { useState, useEffect } from "react";
import axios from "axios";

const UserBookings = ({ id_User }) => {
  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState({});
  const [updateMessage, setUpdateMessage] = useState({
    show: false,
    message: "",
    isError: false,
  });

  console.log("ID del usuario recibido en UserBookings:", id_User);

  useEffect(() => {
    if (!id_User) return; // Evita la petición si no hay ID

    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/booking/user/${id_User}`
        );
        console.log("Reservas obtenidas:", response.data);
        setBookings(response.data);
      } catch (error) {
        console.error("Error al obtener las reservas:", error);
        alert("Error al obtener las reservas");
      }
    };

    fetchBookings();
  }, [id_User]);

  // Inicializa formData con los datos de cada reserva
  useEffect(() => {
    console.log("Inicializando formData con bookings:", bookings);
    const initialFormData = {};
    bookings.forEach((booking) => {
      const passengers = Array(booking.totalPeople || 1)
        .fill()
        .map((_, index) => {
          if (index === 0) {
            return {
              DNI: booking.DNI || "",
              passengerName: booking.passengerName || "",
            };
          }
          return {
            DNI: "",
            passengerName: "",
          };
        });

      initialFormData[booking.id_Booking] = passengers;
    });
    console.log("Form Data inicial:", initialFormData);
    setFormData(initialFormData);
  }, [bookings]);

  // Maneja el cambio en los inputs
  const handleInputChange = (bookingId, index, field, value) => {
    console.log(
      `handleInputChange para booking ${bookingId}, index ${index}, campo ${field}, valor ${value}`
    );
    setFormData((prevData) => {
      const updatedPassengers = prevData[bookingId].map((passenger, i) =>
        i === index ? { ...passenger, [field]: value } : passenger
      );
      console.log("Pasajeros actualizados para booking", bookingId, ":", updatedPassengers);
      return { ...prevData, [bookingId]: updatedPassengers };
    });
  };

  // Actualiza la información de una reserva usando el endpoint de actualización
  const handleUpdate = async (bookingId, passengerIndex) => {
    try {
      const passenger = formData[bookingId][passengerIndex];

      console.log(
        "URL:",
        `${import.meta.env.VITE_API_URL}/booking/id/${bookingId}`
      );
      console.log("Datos a enviar:", {
        DNI: passenger.DNI,
        passengerName: passenger.passengerName,
      });

      const formattedDNI = passenger.DNI ? parseInt(passenger.DNI) : null;

      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/booking/id/${bookingId}`,
        {
          DNI: formattedDNI,
          passengerName: passenger.passengerName,
        }
      );

      if (response.status === 200) {
        setUpdateMessage({
          show: true,
          message: `Datos del pasajero ${passengerIndex + 1} actualizados correctamente`,
          isError: false,
        });

        setTimeout(() => {
          setUpdateMessage({ show: false, message: "", isError: false });
        }, 3000);
      }
    } catch (error) {
      console.error("Error al actualizar la reserva:", error);
      console.log("Detalles del error:", error.response);

      setUpdateMessage({
        show: true,
        message: `Error al actualizar los datos del pasajero ${passengerIndex + 1}`,
        isError: true,
      });

      setTimeout(() => {
        setUpdateMessage({ show: false, message: "", isError: false });
      }, 3000);
    }
  };

  // Función para formatear la fecha y hora de la excursión
  const formatDate = (dateString) => {
    if (!dateString) return "No disponible";
    // Reemplaza el espacio por 'T' para formar una fecha ISO
    const isoString = dateString.includes(" ") ? dateString.replace(" ", "T") : dateString;
    const date = new Date(isoString);
    if (isNaN(date)) return "Fecha inválida";
    const dia = date.getDate().toString().padStart(2, "0");
    const mes = (date.getMonth() + 1).toString().padStart(2, "0");
    const año = date.getFullYear();
    const hora = date.getHours().toString().padStart(2, "0");
    const minutos = date.getMinutes().toString().padStart(2, "0");
    return `${dia}/${mes}/${año} - ${hora}:${minutos}hs`;
  };

  const isBookingPast = (dateString) => {
    const isoString = dateString.includes(" ") ? dateString.replace(" ", "T") : dateString;
    const excursionDate = new Date(isoString);
    const currentDate = new Date();
    return excursionDate < currentDate;
  };

  console.log("Render: bookings:", bookings);
  console.log("Render: formData:", formData);

  return (
    <div className="container mx-auto p-6 mt-16 bg-[#f9f3e1] border-l-4 border-[#425a66] rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-[#4256a6] font-poppins">
        Mis Reservas
      </h1>

      {/* Mostrar mensaje si existe */}
      {updateMessage.show && (
        <div
          className={`p-3 rounded-md mb-4 ${
            updateMessage.isError
              ? "bg-red-100 text-red-700 border border-red-300"
              : "bg-green-100 text-green-700 border border-green-300"
          }`}
        >
          {updateMessage.message}
        </div>
      )}

      {bookings.length > 0 ? (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking.id_Booking}
              className={`bg-[#dac9aa] shadow-md rounded-lg p-6 border border-[#425a66] hover:shadow-lg transition-shadow ${
                isBookingPast(booking.dateTime) ? "opacity-60" : ""
              }`}
            >
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-[#4256a6] font-poppins mb-2">
                  {booking.serviceTitle}
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm text-[#425a66]">
                  <div className="bg-[#f9f3e1] p-3 rounded-lg">
                    <span className="font-semibold">Fecha y Hora:</span>
                    <p className="mt-1">{formatDate(booking.dateTime)}</p>
                    {isBookingPast(booking.dateTime) && (
                      <p className="text-red-500 text-sm mt-1">
                        Esta reserva ya ha pasado
                      </p>
                    )}
                  </div>
                  <div className="bg-[#f9f3e1] p-3 rounded-lg">
                    <span className="font-semibold">Estado:</span>
                    <p
                      className={`mt-1 font-medium ${
                        booking.status === "Completada"
                          ? "text-green-600"
                          : isBookingPast(booking.dateTime)
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {isBookingPast(booking.dateTime)
                        ? "Finalizada"
                        : booking.status}
                    </p>
                  </div>
                </div>
              </div>

              {!isBookingPast(booking.dateTime) && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-[#425a66] mb-3">
                    Información de Pasajeros ({booking.totalPeople || 1})
                  </h4>
                  <div className="flex flex-row gap-4 overflow-x-auto pb-2">
                    {formData[booking.id_Booking] &&
                      formData[booking.id_Booking].map((passenger, index) => (
                        <div
                          key={index}
                          className="min-w-[300px] p-4 bg-[#dac9aa] rounded-lg border border-[#425a66]/20 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <p className="text-sm font-semibold text-[#425a66] mb-3 border-b border-[#425a66]/20 pb-2">
                            Pasajero {index + 1} de {booking.totalPeople || 1}
                          </p>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-[#425a66] mb-1">
                              Nombre
                            </label>
                            <input
                              type="text"
                              value={passenger.passengerName}
                              onChange={(e) =>
                                handleInputChange(
                                  booking.id_Booking,
                                  index,
                                  "passengerName",
                                  e.target.value
                                )
                              }
                              className="w-full p-2 border rounded-md text-black bg-white/90 focus:ring-2 focus:ring-[#4256a6] focus:border-transparent"
                              placeholder="Ingrese nombre"
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-[#425a66] mb-1">
                              DNI
                            </label>
                            <input
                              type="text"
                              value={passenger.DNI}
                              onChange={(e) =>
                                handleInputChange(
                                  booking.id_Booking,
                                  index,
                                  "DNI",
                                  e.target.value
                                )
                              }
                              className="w-full p-2 border rounded-md text-black bg-white/90 focus:ring-2 focus:ring-[#4256a6] focus:border-transparent"
                              placeholder="Ingrese DNI"
                            />
                          </div>
                          <button
                            onClick={() =>
                              handleUpdate(booking.id_Booking, index)
                            }
                            className="w-full bg-[#4256a6] text-white px-4 py-2 rounded-md hover:bg-[#2c3d8f] transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-[#4256a6]"
                          >
                            Actualizar Pasajero {index + 1}
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[#4256a6] font-poppins">
          No tienes reservas recientes.
        </p>
      )}
    </div>
  );
};

export default UserBookings;
