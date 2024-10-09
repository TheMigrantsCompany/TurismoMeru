//vista para todo lo que corresponda a la gestion de reservas.
// INPUT DE BUSQUEDA - TABLA DE RESERVAS - MODAL  PARA VER Y MODIFICAR RESERVAS - SWEETALERT PARA de éxito o error al realizar acciones (modificar, eliminar, confirmar reservas). 

import React from 'react';
import SearchInput from '../../../components/inputs/SearchInput'; 

export function ReservationManagement() {
  const handleSearch = (query) => {
    // Aquí iría la función de búsqueda
    console.log('Buscar reservas con:', query);
  };

  return (
    <div>
      <h1>Gestión de Reservas</h1>
      <SearchInput onSearch={handleSearch} />
      {/* Aquí iría el resto de tu contenido, como la tabla de reservas */}
    </div>
  );
}
