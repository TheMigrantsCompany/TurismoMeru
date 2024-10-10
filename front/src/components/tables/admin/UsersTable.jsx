import React, { useState } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Chip, IconButton, Button } from "@material-tailwind/react";

const UserTable = ({ users, onEdit }) => {
    const [filteredUsers, setFilteredUsers] = useState(users);
  
    const handleDeleteUser = (id) => {
      // Lógica para eliminar usuario
    };
  
    const filterUsers = (status) => {
      if (status === "all") {
        setFilteredUsers(users);
      } else {
        setFilteredUsers(users.filter(user => user.active === (status === "active")));
      }
    };
  
    return (
      <div>
        <div className="flex space-x-4 mb-4">
          <Button onClick={() => filterUsers("all")} color="blue">Todos</Button>
          <Button onClick={() => filterUsers("active")} color="green">Activos</Button>
          <Button onClick={() => filterUsers("inactive")} color="red">Inactivos</Button>
        </div>
        <table className="text-center min-w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-gray-900">Nombre</th>
              <th className="text-gray-900">Documento</th>
              <th className="text-gray-900">Email</th>
              <th className="text-gray-900">Estado</th>
              <th className="text-gray-900">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td className="text-gray-900">{user.name}</td>
                <td className="text-gray-900">{user.document}</td>
                <td className="text-gray-900">{user.email}</td>
                <td>
                  <Chip color={user.active ? "green" : "red"} value={user.active ? "Activo" : "Inactivo"} />
                </td>
                <td className="items-center flex justify-center gap-2">
                  <IconButton onClick={() => onEdit(user)}>
                    <PencilIcon className="h-5 w-5" />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteUser(user.id)}>
                    <TrashIcon className="h-5 w-5" />
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