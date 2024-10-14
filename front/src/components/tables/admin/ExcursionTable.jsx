import React, { useState } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Chip, IconButton, Button } from "@material-tailwind/react";

const ExcursionTable = ({ excursions, onEdit }) => {
    const [filteredExcursions, setFilteredExcursions] = useState(excursions);

    const handleDeleteExcursion = (id) => {
        // Lógica para eliminar excursión
    };

    const filterExcursions = (status) => {
        if (status === "all") {
            setFilteredExcursions(excursions);
        } else {
            setFilteredExcursions(excursions.filter(excursion => excursion.active === (status === "active")));
        }
    };

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
                    {filteredExcursions.map(excursion => (
                        <tr key={excursion.id}>
                            <td className="text-gray-900">{excursion.name}</td>
                            <td className="text-gray-900">{excursion.description}</td>
                            <td className="text-gray-900">{excursion.capacity}</td>
                            <td className="text-gray-900">{excursion.price}</td>
                            <td className="text-gray-900">{excursion.reservations}</td>
                            <td>
                                <Chip color={excursion.active ? "green" : "red"} value={excursion.active ? "Activa" : "Inactiva"} />
                            </td>
                            <td className="items-center flex justify-center gap-2">
                                <IconButton onClick={() => onEdit(excursion)}>
                                    <PencilIcon className="h-5 w-5" />
                                </IconButton>
                                <IconButton onClick={() => handleDeleteExcursion(excursion.id)}>
                                    <TrashIcon className="h-5 w-5" />
                                </IconButton>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ExcursionTable;
