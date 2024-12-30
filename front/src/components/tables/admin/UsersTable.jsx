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

const UserTable = ({ users = [], onFilterChange, onDelete, onToggleActive, onViewDetails }) => {
  return (
    <Card className="h-full w-full mt-16 bg-[#f9f3e1] shadow-lg rounded-lg">
      {/* Botones de filtrado */}
      <div className="flex justify-start space-x-4 p-4 bg-[#f9f3e1]">
        <Button
          onClick={() => onFilterChange("all")}
          className="bg-[#4256a6] text-white py-2 rounded-lg hover:bg-[#364d73] transition-colors"
        >
          Todos
        </Button>
        <Button
          onClick={() => onFilterChange("active")}
          className="bg-[#f4925b] text-white py-2 rounded-lg hover:bg-[#d98248] transition-colors"
        >
          Activos
        </Button>
        <Button
          onClick={() => onFilterChange("inactive")}
          className="bg-[#152817] text-white py-2 rounded-lg hover:bg-[#0f1e11] transition-colors"
        >
          Inactivos
        </Button>
      </div>

      <CardBody className="p-0">
        <table className="w-full table-auto text-left">
          <thead>
            <tr>
              {["Nombre", "Documento", "Email", "Estado", "Acciones"].map((header) => (
                <th
                  key={header}
                  className="p-4 border-y border-[#4256a6] bg-[#f0f5fc]"
                >
                  <Typography variant="small" color="blue-gray" className="text-[#4256a6]">
                    {header}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user.id_User}
                  className="hover:bg-[#e1d4b0] transition-colors border-b border-[#4256a6]"
                >
                  <td className="p-4 text-[#4256a6]">{user.name}</td>
                  <td className="p-4 text-[#4256a6]">{user.document}</td>
                  <td className="p-4 text-[#4256a6]">{user.email}</td>
                  <td className="p-4 text-[#4256a6]">
                    <Chip
                      variant="ghost"
                      size="sm"
                      value={user.active ? "Activo" : "Inactivo"}
                      color={user.active ? "green" : "red"}
                      className="text-[#4256a6]"
                    />
                  </td>
                  <td className="p-4 text-[#4256a6]">
                    <div className="flex gap-2">
                      <Tooltip content="Ver Detalles">
                        <IconButton
                          variant="text"
                          onClick={() => onViewDetails(user)}
                          className="text-[#4256a6]"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip content="Eliminar Usuario">
                        <IconButton
                          variant="text"
                          onClick={() => onDelete(user.id_User)}
                          className="text-[#4256a6]"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip content={user.active ? "Desactivar Usuario" : "Activar Usuario"}>
                        <IconButton
                          variant="text"
                          onClick={() => onToggleActive(user.id_User)}
                          className="text-[#4256a6]"
                        >
                          <Typography className="text-sm">
                            {user.active ? "D" : "A"}
                          </Typography>
                        </IconButton>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-[#4256a6]">
                  No se encontraron resultados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
};

export default UserTable;
