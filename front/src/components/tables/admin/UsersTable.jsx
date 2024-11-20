import React from "react";
import { TrashIcon, EyeIcon } from "@heroicons/react/24/outline";
import { Chip, IconButton } from "@material-tailwind/react";

const UserTable = ({ users = [], onDelete, onToggleActive, onViewDetails }) => {
  const filterUsers = (status) => {
    if (!users) return [];
    if (status === "all") return users;
    return users.filter((user) => user.active === (status === "active"));
  };

  const [filter, setFilter] = React.useState("all");

  return (
    <div>
      <div className="flex space-x-4 mb-4">
        <button onClick={() => setFilter("all")}>Todos</button>
        <button onClick={() => setFilter("active")}>Activos</button>
        <button onClick={() => setFilter("inactive")}>Inactivos</button>
      </div>
      <table className="table-auto text-center min-w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th>Nombre</th>
            <th>Documento</th>
            <th>Email</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filterUsers(filter).map((user) => (
            <tr key={user.id_User}>
              <td>{user.name}</td>
              <td>{user.document}</td>
              <td>{user.email}</td>
              <td>
                <Chip color={user.active ? "green" : "red"} value={user.active ? "Activo" : "Inactivo"} />
              </td>
              <td className="flex justify-center gap-2">
                <IconButton onClick={() => onViewDetails(user)} color="blue">
                  <EyeIcon />
                </IconButton>
                <IconButton onClick={() => onDelete(user.id_User)} color="red">
                  <TrashIcon />
                </IconButton>
                <IconButton onClick={() => onToggleActive(user.id_User)} color={user.active ? "red" : "green"}>
                  {user.active ? "D" : "A"}
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
