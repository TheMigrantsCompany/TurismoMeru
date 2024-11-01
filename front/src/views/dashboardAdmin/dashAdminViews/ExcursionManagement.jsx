import React, { useState, useEffect } from 'react';
import SearchInput from '../../../components/inputs/SearchInput';
import ExcursionTable from '../../../components/tables/admin/ExcursionTable';
import ExcursionModal from '../../../components/modals/admin-modal/ExcursionModal'; 
import NewExcursionModal from '../../../components/modals/admin-modal/NewExcursionModal'; 
import { useDispatch } from 'react-redux';
import { getAllServices } from '../../../redux/actions/actions';

export function ExcursionManagement() {
  const [excursions, setExcursions] = useState([]); 
  const [filteredExcursions, setFilteredExcursions] = useState([]);
  const [selectedExcursion, setSelectedExcursion] = useState(null);
  const [isCreating, setIsCreating] = useState(false); 
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchExcursions = async () => {
      const response = await dispatch(getAllServices()); 
      setExcursions(response); 
      setFilteredExcursions(response);
    };

    fetchExcursions();
  }, [dispatch]);

  const handleSearch = async (query) => {
    if (query.length < 3) {
      setFilteredExcursions([]);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3001/service/name/${query}`);
      setFilteredExcursions(response.data);
    } catch (error) {
      console.error("Error al buscar las excursiones:", error);
      setFilteredExcursions([]);
    }
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