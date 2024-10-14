import React, { useState } from 'react';
import SearchInput from '../../../components/inputs/SearchInput';
import ServiceOrdersTable from '../../../components/tables/admin/ServiceOrdersTable';
import ServiceOrderModal from '../../../components/modals/admin-modal/ServiceOrderModal';

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
export function ServiceOrderManagement() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState(initialServiceOrders);

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
  };

  const handleChangeOrderStatus = (updatedOrder) => {
    setOrders(prevOrders =>
      prevOrders.map(order => (order.id === updatedOrder.id ? updatedOrder : order))
    );
    setSelectedOrder(null);
  };

  return (
    <div className="top-5 gap-5 flex flex-col w-full h-full">
      <h2 className="text-xl text-black font-semibold mb-4">Gestión de Órdenes de Servicio</h2>
      <ServiceOrdersTable orders={orders} onEdit={handleEditOrder} />
      {selectedOrder && (
        <ServiceOrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onChangeStatus={handleChangeOrderStatus}
        />
      )}
    </div>
  );
}
