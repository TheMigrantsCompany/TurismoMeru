import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { getAllServices, deleteService, toggleServiceActiveStatus } from "../../../redux/actions/actions";
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Chip, IconButton, Button } from "@material-tailwind/react";
import ExcursionModal from '../../modals/admin-modal/ExcursionModal';

const selectExcursions = createSelector(
    (state) => state.excursions,
    (excursions) => excursions || []
);

const ExcursionTable = ({ onEdit }) => {
    const dispatch = useDispatch();
    const excursions = useSelector(selectExcursions);
    const [filteredExcursions, setFilteredExcursions] = useState([]);
    const [selectedExcursion, setSelectedExcursion] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        dispatch(getAllServices());
    }, [dispatch]);

    useEffect(() => {
        setFilteredExcursions(excursions);
    }, [excursions]);

    const filterExcursions = (status) => {
        if (status === "all") {
            setFilteredExcursions(excursions);
        } else {
            setFilteredExcursions(excursions.filter(excursion => excursion.active === (status === "active")));
        }
    };

    const handleDeleteExcursion = (title) => {
        dispatch(deleteService(title))
            .then((response) => {
                console.log(response.message);
            })
            .catch((error) => {
                console.error("Error eliminando la excursión:", error);
            });
    };

    const handleToggleActiveStatus = (id_Service) => {
        dispatch(toggleServiceActiveStatus(id_Service));
    };

    const handleEditClick = (excursion) => {
        setSelectedExcursion(excursion);
        setShowModal(true);
    };

    const memoizedExcursions = useMemo(() => filteredExcursions, [filteredExcursions]);

    return (
        <div>
            <div className="flex space-x-4 mb-4">
                <Button onClick={() => filterExcursions("all")} color="blue">Todas</Button>
                <Button onClick={() => filterExcursions("active")} color="green">Activas</Button>
                <Button onClick={() => filterExcursions("inactive")} color="red">Inactivas</Button>
            </div>
            <table className="text-center min-w-full border-collapse border border-gray-200">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="text-gray-900">Nombre</th>
                        <th className="text-gray-900">Descripción</th>
                        <th className="text-gray-900">Capacidad</th>
                        <th className="text-gray-900">Precio</th>
                        <th className="text-gray-900">Reservas</th>
                        <th className="text-gray-900">Estado</th>
                        <th className="text-gray-900">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {memoizedExcursions.map((excursion) => (
                        <tr key={excursion.id || `${excursion.name}-${Math.random()}`}>
                            <td className="text-gray-900">{excursion.title}</td>
                            <td className="text-gray-900">{excursion.description}</td>
                            <td className="text-gray-900">{excursion.stock}</td>
                            <td className="text-gray-900">{excursion.price}</td>
                            <td className="text-gray-900">{excursion.reservations}</td>
                            <td>
                                <Chip color={excursion.active ? "green" : "red"} value={excursion.active ? "Activa" : "Inactiva"} />
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
                    ))}
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

