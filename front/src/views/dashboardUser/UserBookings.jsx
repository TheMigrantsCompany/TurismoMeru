import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const UserBookings = ({ id_User }) => {
  const [bookings, setBookings] = useState([]);
  const [groupedData, setGroupedData] = useState([]);
  const [formData, setFormData] = useState({});

  const groupBookings = (bookings) => {
    return bookings.reduce((acc, booking) => {
      const key = booking.id_ServiceOrder || booking.serviceTitle + booking.dateTime;
      if (!acc[key]) {
        acc[key] = {
          groupKey: key,
          ...booking,
          passengers: [],
        };
      }
      acc[key].passengers.push({
        DNI: booking.DNI || "",
        passengerName: booking.passengerName || "",
        id_Booking: booking.id_Booking,
      });
      return acc;
    }, {});
  };

 
  useEffect(() => {
    if (!id_User) return; 

    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/booking/user/${id_User}`
        );
        setBookings(response.data);
      } catch (error) {
        console.error("Error al obtener las reservas:", error);
        alert("Error al obtener las reservas");
      }
    };

    fetchBookings();
  }, [id_User]);

  // Agrupa las reservas y inicializa el estado formData
  useEffect(() => {
    const grouped = groupBookings(bookings);
    setGroupedData(Object.values(grouped));

    // Inicializa formData para cada grupo con la info de cada pasajero
    const initialFormData = {};
    Object.values(grouped).forEach((group) => {
      initialFormData[group.groupKey] = group.passengers.map((passenger) => ({
        DNI: passenger.DNI,
        passengerName: passenger.passengerName,
        id_Booking: passenger.id_Booking,
      }));
    });
    console.log("Form Data inicial agrupado:", initialFormData);
    setFormData(initialFormData);
  }, [bookings]);

  // Maneja el cambio en los inputs usando el groupKey
  const handleInputChange = (groupKey, index, field, value) => {
    console.log(
      `handleInputChange para grupo ${groupKey}, index ${index}, campo ${field}, valor ${value}`
    );
    setFormData((prevData) => {
      const updatedPassengers = prevData[groupKey].map((passenger, i) =>
        i === index ? { ...passenger, [field]: value } : passenger
      );
      return { ...prevData, [groupKey]: updatedPassengers };
    });
  };

  // Actualiza la información de un pasajero individualmente usando SweetAlert para notificaciones
  const handleUpdate = async (groupKey, passengerIndex) => {
    try {
      const passenger = formData[groupKey][passengerIndex];
      console.log(
        "URL:",
        `${import.meta.env.VITE_API_URL}/booking/id/${passenger.id_Booking}`
      );
      console.log("Datos a enviar:", {
        DNI: passenger.DNI,
        passengerName: passenger.passengerName,
      });

      const formattedDNI = passenger.DNI ? parseInt(passenger.DNI) : null;

      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/booking/id/${passenger.id_Booking}`,
        {
          DNI: formattedDNI,
          passengerName: passenger.passengerName,
        }
      );

      if (response.status === 200) {
        Swal.fire({
          title: "Éxito",
          text: `Pasajero ${passengerIndex + 1} actualizado correctamente`,
          icon: "success",
          timer: 3000,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      console.error("Error al actualizar el pasajero:", error);
      Swal.fire({
        title: "Error",
        text: `Error al actualizar pasajero ${passengerIndex + 1}`,
        icon: "error",
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  
  const formatDate = (dateString) => {
    if (!dateString) return "No disponible";
   
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



  return (
    <div className="container mx-auto p-6 mt-16 bg-[#f9f3e1] border-l-4 border-[#425a66] rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-[#4256a6] font-poppins">
        Mis Reservas
      </h1>

      {groupedData.length > 0 ? (
        <div className="space-y-6">
          {groupedData.map((group) => (
            <div
              key={group.groupKey}
              className={`bg-[#dac9aa] shadow-md rounded-lg p-6 border border-[#425a66] hover:shadow-lg transition-shadow ${
                isBookingPast(group.dateTime) ? "opacity-60" : ""
              }`}
            >
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-[#4256a6] font-poppins mb-2">
                  {group.serviceTitle}
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm text-[#425a66]">
                  <div className="bg-[#f9f3e1] p-3 rounded-lg">
                    <span className="font-semibold">Fecha y Hora:</span>
                    <p className="mt-1">{formatDate(group.dateTime)}</p>
                    {isBookingPast(group.dateTime) && (
                      <p className="text-red-500 text-sm mt-1">
                        Esta reserva ya ha pasado
                      </p>
                    )}
                  </div>
                  <div className="bg-[#f9f3e1] p-3 rounded-lg">
                    <span className="font-semibold">Estado:</span>
                    <p
                      className={`mt-1 font-medium ${
                        group.status === "Completada"
                          ? "text-green-600"
                          : isBookingPast(group.dateTime)
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {isBookingPast(group.dateTime) ? "Finalizada" : group.status}
                    </p>
                  </div>
                </div>
              </div>

              {!isBookingPast(group.dateTime) && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-[#425a66] mb-3">
                    Información de Pasajeros ({group.passengers.length})
                  </h4>
                  <div className="flex flex-row gap-4 overflow-x-auto pb-2">
                    {formData[group.groupKey] &&
                      formData[group.groupKey].map((passenger, index) => (
                        <div
                          key={index}
                          className="min-w-[300px] p-4 bg-[#dac9aa] rounded-lg border border-[#425a66]/20 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <p className="text-sm font-semibold text-[#4256a6] mb-3 border-b border-[#425a66]/20 pb-2">
                            Pasajero {index + 1} de {group.passengers.length}
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
                                  group.groupKey,
                                  index,
                                  "passengerName",
                                  e.target.value
                                )
                              }
                              className="w-full p-2 border rounded-md text-black bg-white/90 focus:ring-2 focus:ring-[#425a6] focus:border-transparent"
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
                                  group.groupKey,
                                  index,
                                  "DNI",
                                  e.target.value
                                )
                              }
                              className="w-full p-2 border rounded-md text-black bg-white/90 focus:ring-2 focus:ring-[#425a6] focus:border-transparent"
                              placeholder="Ingrese DNI"
                            />
                          </div>
                          <button
                            onClick={() => handleUpdate(group.groupKey, index)}
                            className="w-full bg-[#4256a6] text-white px-4 py-2 rounded-md hover:bg-[#2c3d8f] transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-[#425a6]"
                          >
                            Actualizar
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
