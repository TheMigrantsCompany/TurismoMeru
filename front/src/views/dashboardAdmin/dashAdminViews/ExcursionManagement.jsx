import React, { useEffect, useState } from 'react';
import ExcursionTable from '../../../components/tables/admin/ExcursionTable';
import ExcursionModal from '../../../components/modals/admin-modal/ExcursionModal'; 
import NewExcursionModal from '../../../components/modals/admin-modal/NewExcursionModal'; 
import { useDispatch } from 'react-redux';
import { getAllServices } from '../../../redux/actions/actions';


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
        setExcursions(prevExcursions => 
            prevExcursions.map(excursion => 
                excursion.id_Service === selectedExcursion.id_Service ? { ...excursion, active: isActive } : excursion
            )
        );
    };

    const handleSaveExcursion = (updatedExcursion) => {
        setExcursions(prevExcursions => 
            prevExcursions.map(excursion => (excursion.id_Service === updatedExcursion.id_Service ? updatedExcursion : excursion))
        );
        setSelectedExcursion(null);
    };

    const handleCreateExcursion = (newExcursion) => {
        const newExcursionWithId = { ...newExcursion, id_Service: excursions.length + 1 };
        setExcursions(prevExcursions => {
            const exists = prevExcursions.find(excursion => excursion.id_Service === newExcursionWithId.id_Service);
            if (exists) return prevExcursions; 
            return [...prevExcursions, newExcursionWithId];
        });
        setIsCreating(false); 
    };

    return (
        <div className="top-5 gap-5 flex flex-col w-full h-full">
            <h2 className="text-2xl text-[#4256a6] font-semibold mb-4">Gestión de Excursiones</h2>
            <button
                className="text-sm px-8 bg-[#4256a6] text-white rounded-md mb-4 mr-auto" 
                onClick={() => setIsCreating(true)}
            >
                Crear Excursión
            </button>
            
            <ExcursionTable 
                excursions={excursions} 
                onEdit={handleEditExcursion} 
            />
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
