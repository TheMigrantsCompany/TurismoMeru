import React, { useState, useEffect } from 'react';
import SearchInput from '../../../components/inputs/SearchInput';
import ExcursionTable from '../../../components/tables/admin/ExcursionTable';
import ExcursionModal from '../../../components/modals/admin-modal/ExcursionModal';

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

  return (
    <div className="top-5 gap-5 flex flex-col w-full h-full">
      <SearchInput onSearch={handleSearch} />
      <h2 className="text-xl text-black font-semibold mb-4">Gestión de Excursiones</h2>
      <ExcursionTable excursions={filteredExcursions} onEdit={handleEditExcursion} />
      {selectedExcursion && (
        <ExcursionModal
          excursion={selectedExcursion}
          onClose={() => setSelectedExcursion(null)}
          onToggleActive={isActive => handleToggleActive(isActive)}
          onSave={handleSaveExcursion}
        />
      )}
    </div>
  );
}
