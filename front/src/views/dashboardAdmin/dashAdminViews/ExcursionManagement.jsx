import React, { useState, useEffect } from 'react';
import SearchInput from '../../../components/inputs/SearchInput';
import ExcursionTable from '../../../components/tables/admin/ExcursionTable';
import ExcursionModal from '../../../components/modals/admin-modal/ExcursionModal'; // Ya existente
import NewExcursionModal from '../../../components/modals/admin-modal/NewExcursionModal'; // Nuevo modal

const initialExcursions = [
  {
    id: 1,
    name: 'Excursión A',
    description: 'Una hermosa excursión',
    capacity: 20,
    price: 100,
    active: true,
    reservations: 5
  },
  {
    id: 2,
    name: 'Excursión B',
    description: 'Otra excursión asombrosa',
    capacity: 15,
    price: 80,
    active: false,
    reservations: 0
  },
  // Más excursiones
];

export function ExcursionManagement() {
  const [excursions, setExcursions] = useState(initialExcursions);
  const [filteredExcursions, setFilteredExcursions] = useState(initialExcursions);
  const [selectedExcursion, setSelectedExcursion] = useState(null);
  const [isCreating, setIsCreating] = useState(false); // Nuevo estado para creación de excursión

  useEffect(() => {
    // Aquí iría la consulta al backend con fetch para obtener todas las excursiones
    // fetch('/services').then(res => res.json()).then(data => setExcursions(data));
  }, []);

  const handleSearch = (query) => {
    const lowercasedQuery = query.toLowerCase();
    setFilteredExcursions(excursions.filter(excursion =>
      excursion.name.toLowerCase().includes(lowercasedQuery)
    ));
  };

  const handleEditExcursion = (excursion) => {
    setSelectedExcursion(excursion);
  };

  const handleToggleActive = (isActive) => {
    setExcursions(prevExcursions => 
      prevExcursions.map(excursion => 
        excursion.id === selectedExcursion.id ? { ...excursion, active: isActive } : excursion
      )
    );
  };

  const handleSaveExcursion = (updatedExcursion) => {
    setExcursions(prevExcursions => 
      prevExcursions.map(excursion => (excursion.id === updatedExcursion.id ? updatedExcursion : excursion))
    );
    setSelectedExcursion(null);
  };

  const handleCreateExcursion = (newExcursion) => {
    // Añadir la nueva excursión al estado
    setExcursions([...excursions, { ...newExcursion, id: excursions.length + 1 }]);
    setIsCreating(false); // Cierra el modal de creación
  };

  return (
    <div className="top-5 gap-5 flex flex-col w-full h-full">
      <SearchInput onSearch={handleSearch} />
      <h2 className="text-xl text-black font-semibold mb-4">Gestión de Excursiones</h2>
      
      <button
  className="text-sm  px-8 bg-blue-500 text-white rounded-md mb-4 mr-auto" // Alineado a la izquierda y tamaño ajustado
  onClick={() => setIsCreating(true)} // Abrir modal para crear excursión
>
  Crear Excursión
</button>
      
      <ExcursionTable excursions={filteredExcursions} onEdit={handleEditExcursion} />
      
      {selectedExcursion && (
        <ExcursionModal
          excursion={selectedExcursion}
          onClose={() => setSelectedExcursion(null)}
          onToggleActive={handleToggleActive}
          onSave={handleSaveExcursion}
        />
      )}
      
      {isCreating && (
        <NewExcursionModal // Modal para crear nueva excursión
          onClose={() => setIsCreating(false)}
          onSave={handleCreateExcursion}
        />
      )}
    </div>
  );
}
