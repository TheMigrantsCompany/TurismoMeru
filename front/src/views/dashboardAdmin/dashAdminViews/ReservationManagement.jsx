//vista para todo lo que corresponda a la gestion de reservas.
// INPUT DE BUSQUEDA - TABLA DE RESERVAS - MODAL  PARA VER Y MODIFICAR RESERVAS - SWEETALERT PARA de éxito o error al realizar acciones (modificar, eliminar, confirmar reservas).
import React, { useState } from "react";
import SearchInput from "../../../components/inputs/SearchInput";
import { ReservationsTable } from "../../../components/tables/admin/Reservations";
import  ReservationModal  from "../../../components/modals/admin-modal/ReservationModal";
import Swal from "sweetalert2";


export function ReservationManagement() {
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = (query) => {
    console.log('Buscar reservas con:', query);
  };

  const handleEditReservation = (reservation) => {
    setSelectedReservation(reservation);
    setIsModalOpen(true);
  };

  const handleSaveReservation = (updatedReservation) => {
    setSelectedReservation(null);
    setIsModalOpen(false);
    Swal.fire({
      title: 'Reserva actualizada',
      text: 'La reserva ha sido modificada correctamente.',
      icon: 'success',
      confirmButtonText: 'OK'
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <h1>Gestión de Reservas</h1>
      <SearchInput onSearch={handleSearch} />
      <ReservationsTable onEdit={handleEditReservation} />
      {isModalOpen && selectedReservation && (
        <ReservationModal
          reservation={selectedReservation}
          onClose={handleCloseModal}
          onSave={handleSaveReservation}
        />
      )}
    </div>
  );
}