import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { getAllServices, deleteService, toggleServiceActiveStatus } from "../../../redux/actions/actions";
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Chip, IconButton, Button } from "@material-tailwind/react";
import ExcursionModal from '../../modals/admin-modal/ExcursionModal';
import SearchInput from '../../inputs/SearchInput';
import axios from 'axios';

const selectExcursions = createSelector(
    (state) => state.excursions,
    (excursions) => excursions || []
);

const ExcursionTable = () => {
    const dispatch = useDispatch();
    const excursions = useSelector(selectExcursions);
    const [selectedExcursion, setSelectedExcursion] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [filteredExcursions, setFilteredExcursions] = useState([]);
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [timeoutId, setTimeoutId] = useState(null); 

    useEffect(() => {
        dispatch(getAllServices());
    }, [dispatch]);

    useEffect(() => {
        setFilteredExcursions(excursions);
    }, [excursions]);

    const applyFiltersByStatus = (excursionsList, status) => {
        if (status === "active") {
            return excursionsList.filter(excursion => excursion.active);
        } else if (status === "inactive") {
            return excursionsList.filter(excursion => !excursion.active);
        }
        return excursionsList;
    };

    const updateFilteredExcursions = () => {
        const filteredByStatus = applyFiltersByStatus(excursions, filterStatus);
        setFilteredExcursions(filteredByStatus); 
    };

    const handleSearchChange = (query) => {
        setSearchQuery(query);
    
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        const newTimeoutId = setTimeout(async () => {
            if (query.trim().length >= 3) {  
                try {
                    console.log("Realizando búsqueda para:", query);
                    const response = await axios.get(`http://localhost:3001/service/name/${query}`);
                    const searchResults = response.data || [];
                    console.log("Resultados de búsqueda recibidos:", searchResults);
    
                    setFilteredExcursions(searchResults);
                } catch (error) {
                    console.error("Error al buscar la excursión:", error);
                    setFilteredExcursions([]); 
                }
            } else {
                updateFilteredExcursions();
            }
        }, 300); 
        setTimeoutId(newTimeoutId); 
    };

    const filterExcursions = (status) => {
        setFilterStatus(status);
        const filteredByStatus = applyFiltersByStatus(excursions, status);
        console.log("Filtrando excursiones por estado:", status, filteredByStatus);
        setFilteredExcursions(filteredByStatus);
    };

    const handleDeleteExcursion = (title) => {
        dispatch(deleteService(title))
            .then(() => {
                dispatch(getAllServices());
                updateFilteredExcursions();
            })
            .catch(error => console.error("Error eliminando la excursión:", error));
    };

    const handleToggleActiveStatus = (id_Service) => {
        dispatch(toggleServiceActiveStatus(id_Service))
            .then(() => {
                dispatch(getAllServices());
                updateFilteredExcursions();
            })
            .catch(error => console.error("Error cambiando el estado de la excursión:", error));
    };

    const handleEditClick = (excursion) => {
        setSelectedExcursion(excursion);
        setShowModal(true);
    };

    return (
        <div>
            <div className="flex space-x-4 mb-4">
                <Button onClick={() => filterExcursions("all")} color="blue">Todas</Button>
                <Button onClick={() => filterExcursions("active")} color="green">Activas</Button>
                <Button onClick={() => filterExcursions("inactive")} color="red">Inactivas</Button>
            </div>
            <SearchInput onSearch={handleSearchChange} /> 
            <table key={filteredExcursions.length > 0 ? `search-${filteredExcursions[0].id_Service}` : "no-results"}>
                <thead>
                    <tr className="bg-gray-100">
                        <th className="text-gray-900">Nombre</th>
                        <th className="text-gray-900">Descripción</th>
                        <th className="text-gray-900">Capacidad</th>
                        <th className="text-gray-900">Precio</th>
                        <th className="text-gray-900">Estado</th>
                        <th className="text-gray-900">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredExcursions.length > 0 ? (
                        filteredExcursions.map((excursion) => (
                            <tr key={excursion.id_Service}>
                                <td className="text-gray-900">{excursion.title}</td>
                                <td className="text-gray-900">{excursion.description}</td>
                                <td className="text-gray-900">{excursion.stock}</td>
                                <td className="text-gray-900">{excursion.price}</td>
                                <td>
                                    <Chip 
                                        color={excursion.active ? "green" : "red"} 
                                        value={excursion.active ? "Activa" : "Inactiva"} 
                                    />
                                </td>
                                <td className="items-center flex justify-center gap-2">
                                    <IconButton onClick={() => handleEditClick(excursion)}>
                                        <PencilIcon className="h-5 w-5" />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteExcursion(excursion.title)}>
                                        <TrashIcon className="h-5 w-5" />
                                    </IconButton>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                           <td colSpan="6" className="text-center">No se encontraron resultados.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {showModal && (
                <ExcursionModal
                    excursion={selectedExcursion}
                    onClose={() => setShowModal(false)}
                    onToggleActive={handleToggleActiveStatus}
                />
            )}
        </div>
    );
};

export default ExcursionTable;
