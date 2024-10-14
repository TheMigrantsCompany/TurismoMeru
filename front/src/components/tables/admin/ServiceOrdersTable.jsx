import React, { useState } from 'react';
import { PencilIcon } from '@heroicons/react/24/outline';
import { Button, IconButton, Chip } from '@material-tailwind/react';

const initialServiceOrders = [
  {
    id: 1,
    excursionName: 'Excursión A',
    date: '2024-10-15',
    passengers: 10,
    status: 'pending',
  },
  {
    id: 2,
    excursionName: 'Excursión B',
    date: '2024-11-01',
    passengers: 20,
    status: 'completed',
  },
  // Más órdenes de servicio...
];

const ServiceOrdersTable = ({ onEdit }) => {
  const [serviceOrders, setServiceOrders] = useState(initialServiceOrders);
  const [filteredOrders, setFilteredOrders] = useState(serviceOrders);

  const filterOrdersByStatus = (status) => {
    if (status === 'all') {
      setFilteredOrders(serviceOrders);
    } else {
      setFilteredOrders(serviceOrders.filter(order => order.status === status));
    }
  };

  const handleSearchByName = (name) => {
    setFilteredOrders(
      serviceOrders.filter(order =>
        order.excursionName.toLowerCase().includes(name.toLowerCase())
      )
    );
  };

  return (
    <div>
      <div className="flex space-x-4 mb-4">
        <Button onClick={() => filterOrdersByStatus('all')} color="blue">Todas</Button>
        <Button onClick={() => filterOrdersByStatus('pending')} color="yellow">Pendientes</Button>
        <Button onClick={() => filterOrdersByStatus('completed')} color="green">Completadas</Button>
      </div>
      <input
        type="text"
        placeholder="Buscar por nombre de excursión"
        onChange={(e) => handleSearchByName(e.target.value)}
        className="border p-2 mb-4"
      />
      <table className="text-center text-black min-w-full border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th>Nombre de Excursión</th>
            <th>Fecha</th>
            <th>Pasajeros</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map(order => (
            <tr key={order.id}>
              <td>{order.excursionName}</td>
              <td>{order.date}</td>
              <td>{order.passengers}</td>
              <td>
                <Chip
                  color={order.status === 'completed' ? 'green' : 'yellow'}
                  value={order.status === 'completed' ? 'Completada' : 'Pendiente'}
                />
              </td>
              <td>
                <IconButton onClick={() => onEdit(order)}>
                  <PencilIcon className="h-5 w-5" />
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceOrdersTable;
