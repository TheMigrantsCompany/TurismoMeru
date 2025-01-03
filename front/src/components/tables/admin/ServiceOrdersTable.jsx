import React, { useState, useEffect } from 'react';
import { PencilIcon } from '@heroicons/react/24/outline';
import { Button, IconButton, Chip } from '@material-tailwind/react';

const ServiceOrdersTable = ({ orders, onEdit }) => {
  const [filteredOrders, setFilteredOrders] = useState(orders);

  useEffect(() => {
    setFilteredOrders(orders);
  }, [orders]);

  const filterOrdersByStatus = (status) => {
    if (status === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((order) => order.status === status));
    }
  };

  const handleSearchByName = (name) => {
    setFilteredOrders(
      orders.filter((order) =>
        order.excursionName.toLowerCase().includes(name.toLowerCase())
      )
    );
  };

  return (
    <div className="rounded-lg bg-[#f9f3e1] shadow-lg p-6">
      <div className="flex space-x-4 mb-6">
        <Button
          onClick={() => filterOrdersByStatus('all')}
          className="bg-[#4256a6] hover:bg-[#364d73] text-white"
        >
          Todas
        </Button>
        <Button
          onClick={() => filterOrdersByStatus('pending')}
          className="bg-[#f4925b] hover:bg-[#d98248] text-white"
        >
          Pendientes
        </Button>
        <Button
          onClick={() => filterOrdersByStatus('completed')}
          className="bg-[#152817] hover:bg-[#0f1e11] text-white"
        >
          Completadas
        </Button>
      </div>
      <input
        type="text"
        placeholder="Buscar por nombre de excursión"
        onChange={(e) => handleSearchByName(e.target.value)}
        className="w-full p-3 mb-6 border border-[#4256a6] rounded-md focus:outline-none focus:ring focus:ring-[#4256a6]"
      />
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-left">
          <thead>
            <tr className="bg-[#f0f5fc]">
              {['Nombre de Excursión', 'Fecha', 'Pasajeros', 'Estado', 'Acciones'].map((header) => (
                <th
                  key={header}
                  className="p-4 text-sm font-medium text-[#4256a6] border-b border-[#4256a6]"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-[#e1d4b0] transition-colors border-b border-[#4256a6]"
                >
                  <td className="p-4 text-sm text-[#4256a6]">{order.excursionName}</td>
                  <td className="p-4 text-sm text-[#4256a6]">{order.date}</td>
                  <td className="p-4 text-sm text-[#4256a6]">{order.passengers}</td>
                  <td className="p-4 text-sm">
                    <Chip
                      className={`font-semibold ${
                        order.status === 'completed' ? 'bg-green-600 text-white' : 'bg-yellow-500 text-black'
                      }`}
                      value={order.status === 'completed' ? 'Completada' : 'Pendiente'}
                    />
                  </td>
                  <td className="p-4 flex justify-center gap-2">
                    <IconButton
                      onClick={() => onEdit(order)}
                      className="bg-[#4256a6] hover:bg-[#364d73]"
                    >
                      <PencilIcon className="h-5 w-5 text-white" />
                    </IconButton>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-[#4256a6]">
                  No se encontraron órdenes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServiceOrdersTable;
