import React, { useState } from "react";
import { ChevronUpDownIcon, PencilIcon } from "@heroicons/react/24/outline";
import { Card, CardHeader, Typography, CardBody, Chip, Tooltip, IconButton, Button } from "@material-tailwind/react";
import ReservationModal from "../../../components/modals/admin-modal/ReservationModal";
import Swal from "sweetalert2";

const TABLE_HEAD = [
  "Cliente",
  "Excursión",
  "Cantidad de Personas",
  "Estado",
  "Fecha de Excursión",
  "",
];

const initialReservations = [
  {
    passengerName: "Juan Pérez",
    excursionName: "Excursión Glaciar",
    seats: 4,
    status: "accepted",
    excursionDate: "2024-10-12",
    passengerId: "12345678",
    paymentMethod: "Tarjeta de Crédito",
    totalPaid: "$400",
  },
  {
    passengerName: "María López",
    excursionName: "Tour de Ballenas",
    seats: 2,
    status: "pending",
    excursionDate: "2024-11-25",
    passengerId: "87654321",
    paymentMethod: "Transferencia Bancaria",
    totalPaid: "$200",
  },
  {
    passengerName: "Carlos Ruiz",
    excursionName: "Aventura en la Selva",
    seats: 3,
    status: "cancelled",
    excursionDate: "2024-12-15",
    passengerId: "12398765",
    paymentMethod: "Efectivo",
    totalPaid: "$300",
  },
];

export function ReservationsTable() {
  const [reservations, setReservations] = useState(initialReservations);
  const [filteredReservations, setFilteredReservations] = useState(initialReservations);
  const [selectedReservation, setSelectedReservation] = useState(null);

  const handleEditReservation = (reservation) => {
    setSelectedReservation(reservation);
  };

  const handleSaveReservation = (updatedReservation) => {
    setReservations((prevReservations) =>
      prevReservations.map((reservation) =>
        reservation.passengerName === updatedReservation.passengerName
          ? updatedReservation
          : reservation
      )
    );
    Swal.fire({
      title: "¡Reserva modificada!",
      text: "La reserva fue actualizada exitosamente.",
      icon: "success",
      confirmButtonText: "OK",
    });
  };

  const filterReservations = (status) => {
    if (status === "all") {
      setFilteredReservations(reservations);
    } else {
      setFilteredReservations(reservations.filter((reservation) => reservation.status === status));
    }
  };

  return (
    <Card className="h-full w-full mt-16 bg-[#f9f3e1] shadow-lg rounded-lg">
    <CardHeader floated={false} shadow={false} className="p-6 bg-transparent">
      {/* Botones de filtrado */}
      <div className="flex space-x-4">
        <Button
          className="bg-[#4256a6] text-white py-2 rounded-lg hover:bg-[#364d73] transition-colors"
          onClick={() => filterReservations("all")}
        >
          Todas
        </Button>
        <Button
          className="bg-[#f4925b] text-white py-2 rounded-lg hover:bg-[#d98248] transition-colors"
          onClick={() => filterReservations("accepted")}
        >
          Aceptadas
        </Button>
        <Button
          className="bg-[#152817] text-white py-2 rounded-lg hover:bg-[#0f1e11] transition-colors"
          onClick={() => filterReservations("pending")}
        >
          Pendientes
        </Button>
        <Button
          className="bg-[#f44336] text-white py-2 rounded-lg hover:bg-[#d32f2f] transition-colors"
          onClick={() => filterReservations("cancelled")}
        >
          Canceladas
        </Button>
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
            <tr key={reservation.passengerName}>
              <td className="p-4 border-b border-[#4256a6]">{reservation.passengerName}</td>
              <td className="p-4 border-b border-[#4256a6]">{reservation.excursionName}</td>
              <td className="p-4 border-b border-[#4256a6]">{reservation.seats}</td>
              <td className="p-4 border-b border-[#4256a6]">
                <Chip
                  variant="ghost"
                  size="sm"
                  value={reservation.status}
                  color={reservation.status === "accepted" ? "green" : reservation.status === "pending" ? "yellow" : "red"}
                />
              </td>
              <td className="p-4 border-b border-[#4256a6]">{reservation.excursionDate}</td>
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
      <ReservationModal
        reservation={selectedReservation}
        onClose={() => setSelectedReservation(null)}
        onSave={handleSaveReservation}
      />
    )}
  </Card>
  );
}
