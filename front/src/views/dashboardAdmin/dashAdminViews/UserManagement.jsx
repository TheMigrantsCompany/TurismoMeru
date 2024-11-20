import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUsers,
  toggleUserActiveStatus,
  deleteUser,
} from "../../../redux/actions/actions";
import SearchInput from "../../../components/inputs/SearchInput";
import UserTable from "../../../components/tables/admin/UsersTable";
import UserModal from "../../../components/modals/admin-modal/UserModal"; // Modal para ver detalles

export function UserManagement() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.filteredUsers);
  const [selectedUser, setSelectedUser] = useState(null);

  // Carga inicial de usuarios
  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  // Filtrar usuarios
  const handleSearch = (query) => {
    dispatch({ type: "users/filterUsers", payload: query });
  };

  // Activar/Desactivar usuario
  const handleToggleActive = (id_User) => {
    dispatch(toggleUserActiveStatus(id_User));
  };

  // Eliminar usuario
  const handleDeleteUser = (id_User) => {
    dispatch(deleteUser(id_User));
  };

  return (
    <div className="top-5 gap-5 flex flex-col w-full h-full">
      <SearchInput onSearch={handleSearch} />
      <h2 className="text-xl text-black font-semibold mb-4">
        Gestión de Usuarios
      </h2>
      <UserTable
        users={users}
        onViewDetails={setSelectedUser}
        onDelete={handleDeleteUser}
        onToggleActive={handleToggleActive}
      />
      {selectedUser && (
        <UserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onToggleActive={handleToggleActive}
        />
      )}
    </div>
  );
}
