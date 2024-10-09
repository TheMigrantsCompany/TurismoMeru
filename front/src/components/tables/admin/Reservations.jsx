import React, { useState } from 'react';
import { ChevronUpDownIcon, PencilIcon } from "@heroicons/react/24/outline";
import { Card, CardHeader, Typography, CardBody, Chip, Tooltip, IconButton, CardFooter, Tabs, TabsHeader, Tab, Button } from "@material-tailwind/react";
import ReservationModal from '../../../components/modals/admin-modal/ReservationModal';
import Swal from "sweetalert2";

const TABS = [
  { label: "Todas", value: "all" },
  { label: "Aceptadas", value: "accepted" },
  { label: "Pendientes", value: "pending" },
  { label: "Canceladas", value: "cancelled" },
];

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
];

export function ReservationsTable() {
  const [reservations, setReservations] = useState(initialReservations);
  const [selectedReservation, setSelectedReservation] = useState(null);

  const handleEditReservation = (reservation) => {
    setSelectedReservation(reservation); // Abre el modal con la reserva seleccionada
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

  return (
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <Typography variant="h5" color="blue-gray">Gestión de Reservas</Typography>
      </CardHeader>

      <CardBody className="px-0">
        <table className="mt-4 w-full table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th key={head} className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                  <Typography variant="small" color="blue-gray" className="flex items-center justify-between gap-2">
                    {head} <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation, index) => (
              <tr key={reservation.passengerName}>
                <td className="p-4 border-b border-blue-gray-50">{reservation.passengerName}</td>
                <td className="p-4 border-b border-blue-gray-50">{reservation.excursionName}</td>
                <td className="p-4 border-b border-blue-gray-50">{reservation.seats}</td>
                <td className="p-4 border-b border-blue-gray-50">
                  <Chip
                    variant="ghost"
                    size="sm"
                    value={reservation.status}
                    color={reservation.status === "accepted" ? "green" : reservation.status === "pending" ? "yellow" : "red"}
                  />
                </td>
                <td className="p-4 border-b border-blue-gray-50">{reservation.excursionDate}</td>
                <td className="p-4 border-b border-blue-gray-50">
                  <Tooltip content="Editar Reserva">
                    <IconButton variant="text" onClick={() => handleEditReservation(reservation)}>
                      <PencilIcon className="h-4 w-4" />
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