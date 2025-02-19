import React from "react";
import { TrashIcon, EyeIcon } from "@heroicons/react/24/outline";
import {
  Chip,
  IconButton,
  Button,
  Typography,
  Tooltip,
  Card,
  CardBody,
} from "@material-tailwind/react";

const UserTable = ({
  users = [],
  onFilterChange,
  onDelete,
  onToggleActive,
  onViewDetails,
}) => {
  return (
    <div className="w-full bg-[#f9f3e1]">
      {/* Botones de filtrado */}
      <div className="flex justify-start gap-4 p-4">
        <Button
          onClick={() => onFilterChange("all")}
          className="bg-[#4256a6] text-white px-6 py-2 rounded-lg hover:bg-[#334477] transition-colors font-poppins"
        >
          Todos
        </Button>
        <Button
          onClick={() => onFilterChange("active")}
          className="bg-[#f4925b] text-white px-6 py-2 rounded-lg hover:bg-[#d98248] transition-colors font-poppins"
        >
          Activos
        </Button>
        <Button
          onClick={() => onFilterChange("inactive")}
          className="bg-[#425a66] text-white px-6 py-2 rounded-lg hover:bg-[#2f4047] transition-colors font-poppins"
        >
          Inactivos
        </Button>
      </div>

      <div className="overflow-x-auto bg-[#f9f3e1]">
        <table className="w-full min-w-max table-auto text-left bg-[#f9f3e1]">
          <thead>
            <tr>
              {["Nombre", "Documento", "Email", "Estado", "Acciones"].map(
                (header) => (
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
                )
              )}
            </tr>
          </thead>
          <tbody className="bg-[#f9f3e1]">
            {users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user.id_User}
                  className="hover:bg-[#dac9aa]/30 transition-colors border-b border-[#425a66]/20"
                >
                  <td className="p-4">
                    <Typography className="font-poppins text-[#425a66]">
                      {user.name}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography className="font-poppins text-[#425a66]">
                      {user.DNI}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography className="font-poppins text-[#425a66]">
                      {user.email}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Chip
                      variant="ghost"
                      size="sm"
                      value={user.active ? "Activo" : "Inactivo"}
                      className={`font-poppins ${
                        user.active
                          ? "text-green-600 bg-green-100"
                          : "text-red-600 bg-red-100"
                      }`}
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex gap-3">
                      <Tooltip content="Ver Detalles">
                        <IconButton
                          variant="text"
                          onClick={() => onViewDetails(user)}
                          className="text-[#4256a6] hover:bg-[#4256a6]/10"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip content="Eliminar Usuario">
                        <IconButton
                          variant="text"
                          onClick={() => onDelete(user.id_User)}
                          className="text-red-500 hover:bg-red-100"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip
                        content={
                          user.active ? "Desactivar Usuario" : "Activar Usuario"
                        }
                      >
                        <Button
                          size="sm"
                          onClick={() => onToggleActive(user.id_User)}
                          className={`px-3 py-1 rounded font-poppins ${
                            user.active
                              ? "bg-red-100 text-red-600 hover:bg-red-200"
                              : "bg-green-100 text-green-600 hover:bg-green-200"
                          }`}
                        >
                          {user.active ? "Desactivar" : "Activar"}
                        </Button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center">
                  <Typography className="font-poppins text-[#4256a6]">
                    No se encontraron resultados.
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

export default UserTable;
