import React from "react";
import { TrashIcon, EyeIcon } from "@heroicons/react/24/outline";
import { Chip, IconButton, Button, Typography, Tooltip, Card, CardHeader, CardBody } from "@material-tailwind/react";

const UserTable = ({ users = [], onFilterChange, onDelete, onToggleActive, onViewDetails }) => {
  return (
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <Typography variant="h5" color="blue-gray">Gestión de Usuarios</Typography>

        {/* Botones de filtrado */}
        <div className="flex space-x-4 mt-4">
          <Button onClick={() => onFilterChange("all")} color="blue" className="bg-[#4256a6] text-white">Todos</Button>
          <Button onClick={() => onFilterChange("active")} color="green" className="bg-[#f9f3e1] text-black">Activos</Button>
          <Button onClick={() => onFilterChange("inactive")} color="red" className="bg-[#425a66] text-white">Inactivos</Button>
        </div>
      </CardHeader>

      <CardBody className="px-0">
        <table className="mt-4 w-full table-auto text-left">
          <thead>
            <tr>
              <th className="p-4 border-y border-blue-gray-100 bg-[#f9f3e1]">
                <Typography variant="small" color="blue-gray">Nombre</Typography>
              </th>
              <th className="p-4 border-y border-blue-gray-100 bg-[#f9f3e1]">
                <Typography variant="small" color="blue-gray">Documento</Typography>
              </th>
              <th className="p-4 border-y border-blue-gray-100 bg-[#f9f3e1]">
                <Typography variant="small" color="blue-gray">Email</Typography>
              </th>
              <th className="p-4 border-y border-blue-gray-100 bg-[#f9f3e1]">
                <Typography variant="small" color="blue-gray">Estado</Typography>
              </th>
              <th className="p-4 border-y border-blue-gray-100 bg-[#f9f3e1]">
                <Typography variant="small" color="blue-gray">Acciones</Typography>
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id_User}>
                  <td className="p-4 border-b border-blue-gray-50 text-black">{user.name}</td>
                  <td className="p-4 border-b border-blue-gray-50 text-black">{user.document}</td>
                  <td className="p-4 border-b border-blue-gray-50 text-black">{user.email}</td>
                  <td className="p-4 border-b border-blue-gray-50">
                    <Chip
                      variant="ghost"
                      size="sm"
                      value={user.active ? "Activo" : "Inactivo"}
                      color={user.active ? "green" : "red"}
                    />
                  </td>
                  <td className="p-4 border-b border-blue-gray-50 flex gap-2">
                    <Tooltip content="Ver Detalles">
                      <IconButton variant="text" onClick={() => onViewDetails(user)} className="text-[#4256a6]">
                        <EyeIcon className="h-4 w-4" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip content="Eliminar Usuario">
                      <IconButton variant="text" onClick={() => onDelete(user.id_User)} className="text-[#4256a6]">
                        <TrashIcon className="h-4 w-4" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip content={user.active ? "Desactivar Usuario" : "Activar Usuario"}>
                      <IconButton variant="text" onClick={() => onToggleActive(user.id_User)} className="text-[#4256a6]">
                        <Typography className="h-4 w-4">{user.active ? "D" : "A"}</Typography>
                      </IconButton>
                    </Tooltip>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-black">No se encontraron resultados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
};

export default UserTable;
