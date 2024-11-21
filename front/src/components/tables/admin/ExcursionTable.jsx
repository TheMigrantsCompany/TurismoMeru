import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { getAllServices, deleteService, toggleServiceActiveStatus } from "../../../redux/actions/actions";
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Card, CardHeader, CardBody, Chip, IconButton, Button, Typography, Tooltip } from "@material-tailwind/react";
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
                    const response = await axios.get(`http://localhost:3001/service/name/${query}`);
                    const searchResults = response.data || [];
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

    const updateExcursionLocally = (updatedExcursion) => {
        setFilteredExcursions((prevExcursions) =>
            prevExcursions.map((excursion) =>
                excursion.id_Service === updatedExcursion.id_Service ? updatedExcursion : excursion
            )
        );
    };

    return (
        <Card className="h-full w-full">
            <CardHeader floated={false} shadow={false} className="rounded-none">
                <Typography variant="h5" color="blue-gray">Gestión de Excursiones</Typography>

                {/* Botones de filtrado */}
                <div className="flex space-x-4 mt-4">
                    <Button onClick={() => filterExcursions("all")} color="blue">Todas</Button>
                    <Button onClick={() => filterExcursions("active")} color="green">Activas</Button>
                    <Button onClick={() => filterExcursions("inactive")} color="red">Inactivas</Button>
                </div>
            </CardHeader>

            <CardBody className="px-0">
                <SearchInput onSearch={handleSearchChange} />
                <table className="mt-4 w-full table-auto text-left">
                    <thead>
                        <tr>
                            <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                                <Typography variant="small" color="blue-gray" className="flex items-center">
                                    Nombre
                                </Typography>
                            </th>
                            <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                                <Typography variant="small" color="blue-gray">Capacidad</Typography>
                            </th>
                            <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                                <Typography variant="small" color="blue-gray">Precio</Typography>
                            </th>
                            <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                                <Typography variant="small" color="blue-gray">Estado</Typography>
                            </th>
                            <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                                <Typography variant="small" color="blue-gray">Acciones</Typography>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredExcursions.length > 0 ? (
                            filteredExcursions.map((excursion) => (
                                <tr key={excursion.id_Service}>
                                    <td className="p-4 border-b border-blue-gray-50 text-black">{excursion.title}</td>
                                    <td className="p-4 border-b border-blue-gray-50 text-black">{excursion.stock}</td>
                                    <td className="p-4 border-b border-blue-gray-50 text-black">{excursion.price}</td>
                                    <td className="p-4 border-b border-blue-gray-50">
                                        <Chip
                                            variant="ghost"
                                            size="sm"
                                            value={excursion.active ? "Activa" : "Inactiva"}
                                            color={excursion.active ? "green" : "red"}
                                        />
                                    </td>
                                    <td className="p-4 border-b border-blue-gray-50">
                                        <Tooltip content="Editar Excursión">
                                            <IconButton variant="text" onClick={() => handleEditClick(excursion)}>
                                                <PencilIcon className="h-4 w-4" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip content="Eliminar Excursión">
                                            <IconButton variant="text" onClick={() => handleDeleteExcursion(excursion.title)}>
                                                <TrashIcon className="h-4 w-4" />
                                            </IconButton>
                                        </Tooltip>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center text-black">No se encontraron resultados.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </CardBody>

            {showModal && (
                <ExcursionModal
                    excursion={selectedExcursion}
                    onClose={() => setShowModal(false)}
                    onToggleActive={handleToggleActiveStatus}
                    onUpdate={updateExcursionLocally}
                />
            )}
        </Card>
    );
};

export default ExcursionTable;
