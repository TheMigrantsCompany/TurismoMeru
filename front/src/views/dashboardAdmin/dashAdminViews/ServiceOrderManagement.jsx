import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrders,
  deleteServiceOrder,
} from "../../../redux/actions/actions";
import ServiceOrdersTable from "../../../components/tables/admin/ServiceOrdersTable";
import ServiceOrderModal from "../../../components/modals/admin-modal/ServiceOrderModal";
import Swal from "sweetalert2";

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

      // Normalizar el estado de pago
      let status = order.paymentStatus.toLowerCase();
      // Asegurarnos de que solo usemos 'pending' o 'completed'
      status = status === "pagado" ? "completed" : "pending";

      console.log("Transformando orden:", {
        id: order.id_ServiceOrder,
        paymentStatus: order.paymentStatus,
        transformedStatus: status,
      });

      return {
        id: order.id_ServiceOrder,
        excursionName: order.paymentInformation[0]?.title || "Sin título",
        date: new Date(order.orderDate).toLocaleDateString(),
        passengers: totalPassengers,
        status: status,
      };
    });
  };

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
  };

  const handleDeleteOrder = (id_ServiceOrder) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4256a6",
      cancelButtonColor: "#f4925b",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: "#f9f3e1",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await dispatch(deleteServiceOrder(id_ServiceOrder));
          Swal.fire({
            title: "¡Eliminado!",
            text: "La orden ha sido eliminada.",
            icon: "success",
            confirmButtonColor: "#4256a6",
            background: "#f9f3e1",
          });
        } catch (error) {
          console.error("Error al eliminar la orden:", error);
          Swal.fire({
            title: "Error",
            text:
              error.response?.data?.message || "No se pudo eliminar la orden.",
            icon: "error",
            confirmButtonColor: "#4256a6",
            background: "#f9f3e1",
          });
        }
      }
    });
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
              onDelete={handleDeleteOrder}
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
