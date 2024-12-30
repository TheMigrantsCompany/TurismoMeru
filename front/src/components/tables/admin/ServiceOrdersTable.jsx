import React, { useState } from 'react';
import { PencilIcon } from '@heroicons/react/24/outline';
import { Button, IconButton, Chip } from '@material-tailwind/react';

const ServiceOrdersTable = ({ orders, onEdit }) => {
  const [filteredOrders, setFilteredOrders] = useState(orders);

  // Actualizar las órdenes filtradas cuando cambien las órdenes desde Redux
  React.useEffect(() => {
    setFilteredOrders(orders);
  }, [orders]);

  const filterOrdersByStatus = (status) => {
    if (status === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === status));
    }
  };

  const handleSearchByName = (name) => {
    setFilteredOrders(
      orders.filter(order =>
        order.excursionName.toLowerCase().includes(name.toLowerCase())
      )
    );
  };

  return (
    <div>
      <div className="flex space-x-4 mb-4">
        <Button onClick={() => filterOrdersByStatus('all')} color="blue" className="bg-[#4256a6] text-white">Todas</Button>
        <Button onClick={() => filterOrdersByStatus('pending')} color="yellow" className="bg-[#f9f3e1] text-black">Pendientes</Button>
        <Button onClick={() => filterOrdersByStatus('completed')} color="green" className="bg-[#425a66] text-white">Completadas</Button>
      </div>
      <input
        type="text"
        placeholder="Buscar por nombre de excursión"
        onChange={(e) => handleSearchByName(e.target.value)}
        className="border p-2 mb-4"
      />
      <table className="text-center text-black min-w-full border border-[#4256a6]">
        <thead className="bg-[#f9f3e1]">
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
                <IconButton onClick={() => onEdit(order)} className="text-[#4256a6]">
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
