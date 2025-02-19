import React, { useEffect, useState } from "react";
import ExcursionTable from "../../../components/tables/admin/ExcursionTable";
import ExcursionModal from "../../../components/modals/admin-modal/ExcursionModal";
import NewExcursionModal from "../../../components/modals/admin-modal/NewExcursionModal";
import { useDispatch } from "react-redux";
import { getAllServices } from "../../../redux/actions/actions";

export function ExcursionManagement() {
  const dispatch = useDispatch();
  const [excursions, setExcursions] = useState([]);
  const [selectedExcursion, setSelectedExcursion] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const fetchExcursions = async () => {
      try {
        const response = await dispatch(getAllServices());
        setExcursions(response || []);
      } catch (error) {
        console.error("Error al obtener las excursiones:", error);
      }
    };

    fetchExcursions();
  }, [dispatch]);

  const handleEditExcursion = (excursion) => {
    setSelectedExcursion(excursion);
  };

  const handleToggleActive = (isActive) => {
    setExcursions((prevExcursions) =>
      prevExcursions.map((excursion) =>
        excursion.id_Service === selectedExcursion.id_Service
          ? { ...excursion, active: isActive }
          : excursion
      )
    );
  };

  const handleSaveExcursion = (updatedExcursion) => {
    setExcursions((prevExcursions) =>
      prevExcursions.map((excursion) =>
        excursion.id_Service === updatedExcursion.id_Service
          ? updatedExcursion
          : excursion
      )
    );
    setSelectedExcursion(null);
  };

  const handleCreateExcursion = (newExcursion) => {
    const newExcursionWithId = {
      ...newExcursion,
      id_Service: excursions.length + 1,
    };
    setExcursions((prevExcursions) => {
      const exists = prevExcursions.find(
        (excursion) => excursion.id_Service === newExcursionWithId.id_Service
      );
      if (exists) return prevExcursions;
      return [...prevExcursions, newExcursionWithId];
    });
    setIsCreating(false);
  };

  return (
    <div className="container mx-auto p-6 bg-[#f9f3e1] rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-[#4256a6] font-poppins">
        Gestión de Excursiones
      </h1>

      <div className="space-y-6">
        <div className="bg-[#f9f3e1]">
          <div className="mb-6">
            <button
              className="px-6 py-2 bg-[#4256a6] text-white rounded-lg hover:bg-[#334477] transition-colors font-poppins"
              onClick={() => setIsCreating(true)}
            >
              Crear Excursión
            </button>
          </div>

          <ExcursionTable
            excursions={excursions}
            onEdit={handleEditExcursion}
          />
        </div>
      </div>

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
