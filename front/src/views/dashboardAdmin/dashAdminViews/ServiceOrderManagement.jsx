import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrders,
  deleteServiceOrder,
  updateOrderStatus,
} from "../../../redux/actions/actions";
import ServiceOrdersTable from "../../../components/tables/admin/ServiceOrdersTable";
import ServiceOrderModal from "../../../components/modals/admin-modal/ServiceOrderModal";
import Swal from "sweetalert2";
import axios from "axios";

export function ServiceOrderManagement() {
  const dispatch = useDispatch();
  const { ordersList, loading, error } = useSelector((state) => state.orders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  const transformOrders = (orders) => {
    return orders.map((order) => {
      console.log("Orden original:", order);

      return {
        id_ServiceOrder: order.id_ServiceOrder,
        id: order.id_ServiceOrder,
        id_User: order.id_User,
        orderDate: order.orderDate,
        paymentMethod: order.paymentMethod,
        paymentInformation: order.paymentInformation,
        total: order.total,
        paymentStatus:
          order.Bookings?.length > 0 ? "Pagado" : order.paymentStatus,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        excursionName: order.paymentInformation?.[0]?.title || "Sin título",
        date: new Date(order.orderDate).toLocaleDateString(),
        passengers: order.paymentInformation?.reduce(
          (sum, info) =>
            sum + (info.adults || 0) + (info.minors || 0) + (info.seniors || 0),
          0
        ),
        babies: order.paymentInformation?.[0]?.babies || 0,
        Bookings: order.Bookings || [],
        status:
          order.Bookings?.length > 0
            ? "completed"
            : order.paymentStatus === "Pagado"
            ? "completed"
            : "pending",
      };
    });
  };

  const transformedOrders = ordersList ? transformOrders(ordersList) : [];
  console.log("Órdenes transformadas:", transformedOrders);

  const handleViewDetail = (order) => {
    console.log("Abriendo modal con orden:", order);
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
    dispatch(getAllOrders());
  };

  const handleDeleteOrder = (order) => {
    console.log("Orden a eliminar:", {
      id: order.id_ServiceOrder,
      status: order.paymentStatus,
      orderComplete: order,
    });

    if (!order.id_ServiceOrder) {
      Swal.fire({
        title: "Error",
        text: "ID de orden no válido",
        icon: "error",
        confirmButtonColor: "#4256a6",
        background: "#f9f3e1",
      });
      return;
    }

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
          await dispatch(deleteServiceOrder(order.id_ServiceOrder));
          dispatch(getAllOrders());
          Swal.fire({
            title: "¡Eliminado!",
            text: "La orden ha sido eliminada.",
            icon: "success",
            confirmButtonColor: "#4256a6",
            background: "#f9f3e1",
          });
        } catch (error) {
          console.error("Error al eliminar orden:", {
            message: error.message,
            responseData: error.response?.data,
            status: error.response?.status,
          });

          Swal.fire({
            title: "Error",
            text:
              error.response?.data?.error || "No se pudo eliminar la orden.",
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
              orders={transformedOrders}
              onViewDetail={handleViewDetail}
              onDelete={handleDeleteOrder}
            />
          )}
        </div>
      </div>

      {isModalOpen && selectedOrder && (
        <ServiceOrderModal order={selectedOrder} onClose={handleCloseModal} />
      )}
    </div>
  );
}