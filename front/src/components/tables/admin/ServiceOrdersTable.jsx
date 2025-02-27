import React, { useState, useEffect } from "react";
import { PencilIcon } from "@heroicons/react/24/outline";
import {
  Button,
  IconButton,
  Typography,
  Tooltip,
} from "@material-tailwind/react";

const ServiceOrdersTable = ({ orders, onEdit }) => {
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [currentFilter, setCurrentFilter] = useState("all");

  useEffect(() => {
    console.log("Órdenes actualizadas:", orders);
    filterOrdersByStatus(currentFilter);
  }, [orders]);

  const filterOrdersByStatus = (status) => {
    setCurrentFilter(status);
    console.log("Filtrando por estado:", status);
    console.log("Órdenes disponibles:", orders);

    if (status === "all") {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter((order) => {
        console.log(`Orden ${order.id}:`, {
          orderStatus: order.status,
          filterStatus: status,
          matches: order.status === status
        });
        return order.status === status;
      });
      
      console.log("Órdenes filtradas:", filtered);
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
                      className={`px-3 py-1 rounded-full font-poppins ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {order.status === "completed"
                        ? "Completada"
                        : "Pendiente"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-3">
                      <Tooltip content="Editar Orden">
                        <IconButton
                          variant="text"
                          onClick={() => onEdit(order)}
                          className="text-[#4256a6] hover:bg-[#4256a6]/10"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </IconButton>
                      </Tooltip>
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
