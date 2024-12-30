import React, { useState } from "react";
import SearchInput from "../../../components/inputs/SearchInput";
import { ReservationsTable } from "../../../components/tables/admin/Reservations";
import ReservationModal from "../../../components/modals/admin-modal/ReservationModal";
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
      confirmButtonText: 'OK',
      background: '#f9f3e1', // Fondo beige claro
      confirmButtonColor: '#4256a6', // Azul
      iconColor: '#4256a6', // Azul
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-[#f9f3e1] min-h-screen p-6">
      <h1 className="text-[#4256a6] font-semibold text-3xl mb-6">Gestión de Reservas</h1>
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
