import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBookings } from "../../../redux/actions/actions";
import { ChevronUpDownIcon, PencilIcon } from "@heroicons/react/24/outline";
import { Card, CardHeader, Typography, CardBody, Chip, Tooltip, IconButton, Button } from "@material-tailwind/react";
import ReservationModal from "../../../components/modals/admin-modal/ReservationModal";
import Swal from "sweetalert2";

const TABLE_HEAD = ["Cliente", "Excursión", "Cantidad de Personas", "Estado", "Fecha de Excursión", ""];

export function ReservationsTable() {
  const dispatch = useDispatch();
  const reservationsState = useSelector((state) => state.bookings); // Asegúrate de que el estado esté bien definido
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    dispatch(getAllBookings());
  }, [dispatch]);

  // Asegúrate de que la respuesta de la API esté en el formato esperado
  const filteredReservations = useMemo(() => {
    if (!Array.isArray(reservationsState.bookingsList)) {
      console.error("filteredReservations no es un array:", reservationsState);
      return []; // Retorna un arreglo vacío si la estructura es incorrecta
    }

    const bookingsList = reservationsState.bookingsList || [];

    console.log('Filtro actual:', filter); // Depura el filtro

    if (filter === "all") return bookingsList;

    return bookingsList.filter((reservation) => reservation.status === filter);
  }, [reservationsState, filter]);

  // Manejo de la edición de una reserva
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

  // Verifica si la API está cargando o si ocurrió algún error
  if (reservationsState.loading) {
    return <div>Loading...</div>;
  }

  if (reservationsState.error) {
    return <div>Error: {reservationsState.error}</div>;
  }

  return (
    <Card className="h-full w-full mt-16 bg-[#f9f3e1] shadow-lg rounded-lg">
      <CardHeader floated={false} shadow={false} className="p-6 bg-transparent">
        <div className="flex space-x-4">
          {["all", "accepted", "pending", "cancelled"].map((status) => (
            <Button
              key={status}
              className={
                `py-2 rounded-lg transition-colors ` +
                (filter === status ? "bg-[#364d73] text-white" : "bg-[#4256a6] text-white hover:bg-[#364d73]")
              }
              onClick={() => setFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardBody className="p-6">
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
                <td className="p-4 border-b border-[#4256a6]">
                  <Chip variant="ghost" size="sm" value={reservation.status} color={reservation.status === "accepted" ? "green" : "red"} />
                </td>
                <td className="p-4 border-b border-[#4256a6]">{new Date(reservation.bookingDate).toLocaleDateString()}</td>
                <td className="p-4 border-b border-[#4256a6]">
                  <Tooltip content="Editar Reserva">
                    <IconButton variant="text" onClick={() => handleEditReservation(reservation)}>
                      <PencilIcon className="h-5 w-5 text-[#4256a6]" />
                    </IconButton>
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardBody>

      {selectedReservation && (
        <ReservationModal reservation={selectedReservation} onClose={() => setSelectedReservation(null)} onSave={handleSaveReservation} />
      )}
    </Card>
  );
}