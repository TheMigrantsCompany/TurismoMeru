import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrders } from '../../../redux/actions/actions'; // Ajusta el path si es necesario
import ServiceOrdersTable from '../../../components/tables/admin/ServiceOrdersTable';
import ServiceOrderModal from '../../../components/modals/admin-modal/ServiceOrderModal';

export function ServiceOrderManagement() {
  const dispatch = useDispatch();
  const { ordersList, loading, error } = useSelector(state => state.orders);

  const [selectedOrder, setSelectedOrder] = useState(null);

  // Transformar las órdenes al formato esperado por la tabla
  const transformOrders = (orders) => {
    return orders.map(order => {
      const totalPassengers =
        order.paymentInformation.reduce(
          (sum, info) => sum + info.adults + info.minors + info.seniors,
          0
        );

      return {
        id: order.id_ServiceOrder,
        excursionName: order.paymentInformation[0]?.title || "Sin título",
        date: new Date(order.orderDate).toLocaleDateString(),
        passengers: totalPassengers,
        status: order.paymentStatus.toLowerCase(), // pendiente o completada
      };
    });
  };

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
  };

  if (loading) return <div>Cargando órdenes...</div>;
  if (error) return <div>Error al cargar órdenes: {error}</div>;

  const transformedOrders = transformOrders(ordersList);

  return (
    <div className="top-5 gap-5 flex flex-col w-full h-full">
      <h2 className="text-xl text-black font-semibold mb-4">Gestión de Órdenes de Servicio</h2>
      <ServiceOrdersTable orders={transformedOrders} onEdit={handleEditOrder} />
      {selectedOrder && (
        <ServiceOrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onChangeStatus={() => {}}
        />
      )}
    </div>
  );
}
