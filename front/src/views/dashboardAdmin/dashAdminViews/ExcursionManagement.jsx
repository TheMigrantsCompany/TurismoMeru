import React, { useState, useEffect } from 'react';
import SearchInput from '../../../components/inputs/SearchInput';
import ExcursionTable from '../../../components/tables/admin/ExcursionTable';
import ExcursionModal from '../../../components/modals/admin-modal/ExcursionModal'; 
import NewExcursionModal from '../../../components/modals/admin-modal/NewExcursionModal'; 
import { useDispatch } from 'react-redux';
import { getAllServices } from '../../../redux/actions/actions'; // Asegúrate de tener esta acción definida

export function ExcursionManagement() {
  const [excursions, setExcursions] = useState([]); // Inicializa como un array vacío
  const [filteredExcursions, setFilteredExcursions] = useState([]);
  const [selectedExcursion, setSelectedExcursion] = useState(null);
  const [isCreating, setIsCreating] = useState(false); // Estado para creación de excursión
  const dispatch = useDispatch();

  useEffect(() => {
    // Aquí puedes llamar a tu acción para obtener las excursiones
    const fetchExcursions = async () => {
      const response = await dispatch(getAllServices()); // Ajusta según cómo se devuelvan las excursiones
      setExcursions(response); // Asegúrate de que `response` contenga el array de excursiones
      setFilteredExcursions(response);
    };

    fetchExcursions();
  }, [dispatch]);

  const handleSearch = (query) => {
    const lowercasedQuery = query.toLowerCase();
    setFilteredExcursions(excursions.filter(excursion =>
      excursion.title.toLowerCase().includes(lowercasedQuery) // Cambia 'name' por 'title' si es necesario
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
    setExcursions([...excursions, { ...newExcursion, id: excursions.length + 1 }]);
    setIsCreating(false); 
  };

  return (
    <div className="top-5 gap-5 flex flex-col w-full h-full">
      <SearchInput onSearch={handleSearch} />
      <h2 className="text-xl text-black font-semibold mb-4">Gestión de Excursiones</h2>
      
      <button
        className="text-sm px-8 bg-blue-500 text-white rounded-md mb-4 mr-auto" 
        onClick={() => setIsCreating(true)}
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
        <NewExcursionModal 
          onClose={() => setIsCreating(false)}
          onSave={handleCreateExcursion}
        />
      )}
    </div>
  );
}