import React, { useState, useEffect } from "react";
import { PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline";
import {
  Button,
  IconButton,
  Typography,
  Tooltip,
} from "@material-tailwind/react";

const ServiceOrdersTable = ({ orders, onViewDetail, onDelete }) => {
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [currentFilter, setCurrentFilter] = useState("all");

  useEffect(() => {
    console.log("Órdenes recibidas en la tabla:", orders);
    filterOrdersByStatus(currentFilter);
  }, [orders, currentFilter]);

  const filterOrdersByStatus = (status) => {
    setCurrentFilter(status);
    if (status === "all") {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter((order) => order.status === status);
      setFilteredOrders(filtered);
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
    <div className="w-full bg-[#f9f3e1]">
      <div className="flex justify-start gap-4 p-4">
        <Button
          onClick={() => filterOrdersByStatus("all")}
          className={`${
            currentFilter === "all" ? "bg-[#4256a6]" : "bg-[#4256a6]/70"
          } text-white px-6 py-2 rounded-lg hover:bg-[#334477] transition-colors font-poppins`}
        >
          Todas
        </Button>
        <Button
          onClick={() => filterOrdersByStatus("pending")}
          className={`${
            currentFilter === "pending" ? "bg-[#f4925b]" : "bg-[#f4925b]/70"
          } text-white px-6 py-2 rounded-lg hover:bg-[#d98248] transition-colors font-poppins`}
        >
          Pendientes
        </Button>
        <Button
          onClick={() => filterOrdersByStatus("completed")}
          className={`${
            currentFilter === "completed" ? "bg-[#425a66]" : "bg-[#425a66]/70"
          } text-white px-6 py-2 rounded-lg hover:bg-[#2f4047] transition-colors font-poppins`}
        >
          Completadas
        </Button>
      </div>

      <div className="px-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre de excursión"
          onChange={(e) => handleSearchByName(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-[#425a66]/20 focus:ring-2 focus:ring-[#4256a6] focus:border-transparent transition-all bg-white"
        />
      </div>

      <div className="overflow-x-auto bg-[#f9f3e1]">
        <table className="w-full min-w-max table-auto text-left bg-[#f9f3e1]">
          <thead>
            <tr>
              {[
                "Nombre de Excursión",
                "Fecha",
                "Pasajeros",
                "Estado",
                "Acciones",
              ].map((header) => (
                <th
                  key={header}
                  className="border-b border-[#425a66] bg-[#dac9aa] p-4"
                >
                  <Typography
                    variant="small"
                    className="font-poppins font-bold text-[#4256a6] opacity-90"
                  >
                    {header}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-[#f9f3e1]">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-[#dac9aa]/30 transition-colors border-b border-[#425a66]/20"
                >
                  <td className="p-4">
                    <Typography className="font-poppins text-[#425a66]">
                      {order.excursionName}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography className="font-poppins text-[#425a66]">
                      {order.date}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography className="font-poppins text-[#425a66]">
                      {order.passengers}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full ${
                        order.Bookings?.length > 0 || order.paymentStatus === "Pagado"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {order.Bookings?.length > 0 ? "Pagado" : order.paymentStatus}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <Tooltip content="Ver Detalle">
                        <IconButton
                          variant="text"
                          onClick={() => onViewDetail(order)}
                          className="text-[#4256a6] hover:bg-[#4256a6]/10"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </IconButton>
                      </Tooltip>
                      {onDelete && (
                        <Tooltip content="Eliminar">
                          <IconButton
                            variant="text"
                            onClick={() => onDelete(order)}
                            className="text-red-500 hover:bg-red-50"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center">
                  <Typography className="font-poppins text-[#4256a6]">
                    No se encontraron órdenes.
                  </Typography>
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
