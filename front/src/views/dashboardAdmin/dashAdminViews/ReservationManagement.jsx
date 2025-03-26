import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getAllOrders } from "../../../redux/actions/actions";
import SearchInput from "../../../components/inputs/SearchInput";
import { ReservationsTable } from "../../../components/tables/admin/Reservations";
import ReservationModal from "../../../components/modals/admin-modal/ReservationModal";
import Swal from "sweetalert2";
import axios from "axios";

export function ReservationManagement() {
  const dispatch = useDispatch();
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reservations, setReservations] = useState(null);
  const [isSearchActive, setIsSearchActive] = useState(false);

  useEffect(() => {
    dispatch(getAllOrders()); 
  }, [dispatch]);

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
        url = `${import.meta.env.VITE_API_URL}/booking/serviceName/${encodeURIComponent(
          query
        )}`;
      } else if (searchType === "passenger") {
        url = `${import.meta.env.VITE_API_URL}/booking/passenger-name/${encodeURIComponent(
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

  const handleViewReservationDetail = (reservation) => {
    setSelectedReservation(reservation);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedReservation(null);
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto p-6 bg-[#f9f3e1] rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-[#4256a6] font-poppins">
        Gestión de Reservas
      </h1>

      <div className="space-y-6">
        <div className="bg-[#f9f3e1]">
          <div className="flex flex-col items-center gap-4 mb-6">
            <SearchInput onSearch={handleSearch} showSelect={true} />
            {isSearchActive && (
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-[#4256a6] text-white rounded-lg hover:bg-[#2c3e7e] transition-colors duration-200 flex items-center gap-2 font-poppins"
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
            onViewDetail={handleViewReservationDetail}
            isSearchActive={isSearchActive}
          />
        </div>
      </div>

      {isModalOpen && selectedReservation && (
        <ReservationModal
          reservation={selectedReservation}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
