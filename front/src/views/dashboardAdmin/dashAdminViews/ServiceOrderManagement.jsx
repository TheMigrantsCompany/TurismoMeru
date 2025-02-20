import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders } from "../../../redux/actions/actions";
import ServiceOrdersTable from "../../../components/tables/admin/ServiceOrdersTable";
import ServiceOrderModal from "../../../components/modals/admin-modal/ServiceOrderModal";

export function ServiceOrderManagement() {
  const dispatch = useDispatch();
  const { ordersList, loading, error } = useSelector((state) => state.orders);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const transformOrders = (orders) => {
    return orders.map((order) => {
      const totalPassengers = order.paymentInformation.reduce(
        (sum, info) => sum + info.adults + info.minors + info.seniors,
        0
      );

      return {
        id: order.id_ServiceOrder,
        excursionName: order.paymentInformation[0]?.title || "Sin título",
        date: new Date(order.orderDate).toLocaleDateString(),
        passengers: totalPassengers,
        status: order.paymentStatus.toLowerCase(),
      };
    });
  };

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
  };

  return (
    <div className="container mx-auto p-6 bg-[#f9f3e1] rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-[#4256a6] font-poppins">
        Gestión de Órdenes de Servicio
      </h1>

      <div className="space-y-6">
        <div className="bg-[#f9f3e1]">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-[#4256a6] font-poppins text-lg">
                Cargando órdenes...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-[#4256a6] font-poppins text-lg">
                Error al cargar órdenes: {error}
              </p>
            </div>
          ) : (
            <ServiceOrdersTable
              orders={transformOrders(ordersList)}
              onEdit={handleEditOrder}
            />
          )}
        </div>
      </div>

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
