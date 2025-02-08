import React, { useState } from "react";
import SearchInput from "../../../components/inputs/SearchInput";
import { ReservationsTable } from "../../../components/tables/admin/Reservations";
import ReservationModal from "../../../components/modals/admin-modal/ReservationModal";
import Swal from "sweetalert2";
import axios from "axios";

export function ReservationManagement() {
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reservations, setReservations] = useState(null);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const handleSearch = async (query, searchType) => {
    if (!query.trim()) {
      setIsSearchActive(false);
      setReservations(null);
      return;
    }

    setIsSearchActive(true);
    try {
      let url = "";
      if (searchType === "service") {
        url = `http://localhost:3001/booking/serviceName/${encodeURIComponent(
          query
        )}`;
      } else if (searchType === "passenger") {
        url = `http://localhost:3001/booking/passenger-name/${encodeURIComponent(
          query
        )}`;
      }

      const response = await axios.get(url);
      console.log("Resultados de búsqueda:", response.data);

      if (!response.data.data || response.data.data.length === 0) {
        Swal.fire({
          title: "Sin resultados",
          text: "No se encontraron reservas que coincidan con la búsqueda.",
          icon: "info",
          confirmButtonText: "OK",
          background: "#f9f3e1",
          confirmButtonColor: "#4256a6",
        });
        setReservations(null);
        return;
      }

      setReservations(response.data.data);
    } catch (error) {
      console.error("Error al buscar las reservas:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudieron obtener las reservas",
        icon: "error",
        confirmButtonText: "OK",
        background: "#f9f3e1",
        confirmButtonColor: "#4256a6",
      });
      setReservations(null);
    }
  };

  const handleReset = () => {
    setReservations(null);
    setIsSearchActive(false);
  };

  const handleEditReservation = (reservation) => {
    setSelectedReservation(reservation);
    setIsModalOpen(true);
  };

  const handleSaveReservation = (updatedReservation) => {
    setSelectedReservation(null);
    setIsModalOpen(false);
    Swal.fire({
      title: "Reserva actualizada",
      text: "La reserva ha sido modificada correctamente.",
      icon: "success",
      confirmButtonText: "OK",
      background: "#f9f3e1", // Fondo beige claro
      confirmButtonColor: "#4256a6", // Azul
      iconColor: "#4256a6", // Azul
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-[#f9f3e1] min-h-screen p-6">
      <h1 className="text-[#4256a6] font-semibold text-3xl mb-6">
        Gestión de Reservas
      </h1>
      <div className="flex flex-col items-center gap-4">
        <SearchInput onSearch={handleSearch} showSelect={true} />
        {isSearchActive && (
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-[#4256a6] text-white rounded-full hover:bg-[#2c3e7e] transition-colors duration-200 flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
            Limpiar búsqueda
          </button>
        )}
      </div>
      <ReservationsTable
        reservations={reservations}
        onEdit={handleEditReservation}
        isSearchActive={isSearchActive}
      />
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
