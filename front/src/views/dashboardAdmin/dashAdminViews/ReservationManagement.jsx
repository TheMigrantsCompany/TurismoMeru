//vista para todo lo que corresponda a la gestion de reservas.
// INPUT DE BUSQUEDA - TABLA DE RESERVAS - MODAL  PARA VER Y MODIFICAR RESERVAS - SWEETALERT PARA de éxito o error al realizar acciones (modificar, eliminar, confirmar reservas).
import React from "react";
import SearchInput from "../../../components/inputs/SearchInput";
import { ReservationsTable } from "../../../components/tables/admin/Reservations";


export function ReservationManagement() {
  const handleSearch = (query) => {
    // Aquí iría la función de búsqueda
    console.log('Buscar reservas con:', query);
  };

  return (
    <div>
      <h1>Gestión de Reservas</h1>
      {/* Input de búsqueda */}
      <SearchInput onSearch={handleSearch} />
      
      {/* Aquí se renderiza la tabla de reservas */}
      <ReservationsTable />

      {/* Aquí podrías agregar el modal y otros componentes adicionales */}
    </div>
  );
}