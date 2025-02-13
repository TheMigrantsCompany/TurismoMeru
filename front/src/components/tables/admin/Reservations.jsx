import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBookings, getBookingsByService } from "../../../redux/actions/actions";
import { PencilIcon } from "@heroicons/react/24/outline";
import { Card, CardHeader, Typography, CardBody, Tooltip, IconButton, Button, Select, Option } from "@material-tailwind/react";

import ReservationModal from "../../../components/modals/admin-modal/ReservationModal";
import Swal from "sweetalert2";

const TABLE_HEAD = ["Cliente", "DNI", "Excursión", "Fecha y Hora", ""];

export function ReservationsTable() {
  const dispatch = useDispatch();
  const reservationsState = useSelector((state) => state.bookings);
  const [selectedReservation, setSelectedReservation] = useState(null);

  // Estado para los filtros
  const [selectedService, setSelectedService] = useState(""); // ID del servicio
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  // Cargar todas las reservas al inicio
  useEffect(() => {
    dispatch(getAllBookings());
  }, [dispatch]);

  // Filtrar las reservas al aplicar filtros
  useEffect(() => {
    if (selectedService || selectedDate || selectedTime) {
      dispatch(getBookingsByService(selectedService, selectedDate, selectedTime));
    }
  }, [dispatch, selectedService, selectedDate, selectedTime]);

  // Filtrar reservas (si no hay filtros aplicados)
  const filteredReservations = useMemo(() => {
    if (!Array.isArray(reservationsState.bookingsList)) {
      console.error("filteredReservations no es un array:", reservationsState);
      return [];
    }

    let filtered = reservationsState.bookingsList;

    if (selectedService) {
      filtered = filtered.filter(
        (booking) => booking.id_Service === selectedService // Usar id_Service en lugar de serviceId
      );
    }

    if (selectedDate) {
      filtered = filtered.filter((booking) => booking.dateTime.includes(selectedDate));
    }

    if (selectedTime) {
      filtered = filtered.filter((booking) => booking.dateTime.includes(selectedTime));
    }

    return filtered;
  }, [reservationsState.bookingsList, selectedService, selectedDate, selectedTime]);

  const handleEditReservation = (reservation) => {
    setSelectedReservation(reservation);
  };

  const handleSaveReservation = () => {
    Swal.fire({
      title: "¡Reserva modificada!",
      text: "La reserva fue actualizada exitosamente.",
      icon: "success",
      confirmButtonText: "OK",
    });
  };

  if (reservationsState.loading) {
    return <div>Loading...</div>;
  }

  if (reservationsState.error) {
    return <div>Error: {reservationsState.error}</div>;
  }

  return (
    <Card className="h-full w-full mt-16 bg-[#f9f3e1] shadow-lg rounded-lg">
      <CardBody className="p-6">
        <div className="mb-4 flex justify-between items-center">
          {/* Filtros */}
          <Select
            label="Seleccionar Servicio"
            value={selectedService}
            onChange={(value) => setSelectedService(value)}
          >
            <Option value="">Todos los Servicios</Option>
            {reservationsState.bookingsList.map((reservation) => (
              <Option key={reservation.id_Booking} value={reservation.id_Service}> {/* Usamos id_Service */}
                {reservation.serviceTitle}
              </Option>
            ))}
          </Select>

          <Select
            label="Seleccionar Fecha"
            value={selectedDate}
            onChange={(value) => setSelectedDate(value)}
          >
            <Option value="">Todas las Fechas</Option>
            {Array.from(new Set(reservationsState.bookingsList.map((reservation) => reservation.dateTime.split(" ")[0]))).map((date) => (
              <Option key={date} value={date}>
                {date}
              </Option>
            ))}
          </Select>

          <Select
            label="Seleccionar Hora"
            value={selectedTime}
            onChange={(value) => setSelectedTime(value)}
          >
            <Option value="">Todas las Horas</Option>
            {Array.from(new Set(reservationsState.bookingsList.map((reservation) => reservation.dateTime.split(" ")[1]))).map((time) => (
              <Option key={time} value={time}>
                {time}
              </Option>
            ))}
          </Select>
        </div>

        <table className="mt-4 w-full table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th key={head} className="p-4 border-y border-[#4256a6] bg-[#f0f5fc]">
                  <Typography variant="small" color="blue-gray" className="text-[#4256a6]">
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredReservations.map((reservation) => (
              <tr key={reservation.id_Booking} className="hover:bg-[#e1d4b0] transition-colors border-b border-[#4256a6]">
                <td className="p-4 border-b border-[#4256a6]">{reservation.DNI}</td>
                <td className="p-4 border-b border-[#4256a6]">{reservation.serviceTitle}</td>
                <td className="p-4 border-b border-[#4256a6]">{reservation.totalPeople}</td>
                <td className="p-4 border-b border-[#4256a6]">{reservation.dateTime}</td>
                <td className="p-4 border-b border-[#4256a6]">
                  <Tooltip content="Editar Reserva">
                    <IconButton variant="text" onClick={() => handleEditReservation(reservation)}>
                      <PencilIcon className="h-5 w-5 text-blue-gray-500" />
                    </IconButton>
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal para editar la reserva */}
        {selectedReservation && (
          <ReservationModal
            reservation={selectedReservation}
            onSave={handleSaveReservation}
            onClose={() => setSelectedReservation(null)}
          />
        )}
      </CardBody>
    </Card>
  );
}