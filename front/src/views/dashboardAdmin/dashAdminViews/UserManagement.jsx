import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, toggleUserActiveStatus, deleteUser } from "../../../redux/actions/actions";
import SearchInput from "../../../components/inputs/SearchInput";
import UserTable from "../../../components/tables/admin/UsersTable";
import UserModal from "../../../components/modals/admin-modal/UserModal";

export function UserManagement() {
  const dispatch = useDispatch();
  const userList = useSelector((state) => state.users.userList);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all"); // Estado para filtro

  // Carga inicial de usuarios
  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  // Actualizar filtrados al cambiar la lista de usuarios o el filtro
  useEffect(() => {
    let filtered = userList;
    if (filterStatus !== "all") {
      filtered = userList.filter((user) => user.active === (filterStatus === "active"));
    }
    setFilteredUsers(filtered);
  }, [userList, filterStatus]);

  // Filtrar usuarios por búsqueda
  const handleSearch = (query) => {
    const lowerQuery = query.toLowerCase();
    setFilteredUsers(
      userList.filter(
        (user) =>
          user.name.toLowerCase().includes(lowerQuery) ||
          user.email.toLowerCase().includes(lowerQuery)
      )
    );
  };

  // Cambiar estado activo/inactivo
  const handleToggleActive = (id_User) => {
    dispatch(toggleUserActiveStatus(id_User));
  };

  // Eliminar usuario
  const handleDeleteUser = (id_User) => {
    dispatch(deleteUser(id_User)).then(() => {
      dispatch(getUsers()); // Recarga los usuarios desde el backend
    });
  };

  return (
    <div className="top-5 gap-5 flex flex-col w-full h-full">
      <SearchInput onSearch={handleSearch} />
      <h2 className="text-xl text-black font-semibold mb-4">Gestión de Usuarios</h2>
      <UserTable
        users={filteredUsers}
        onFilterChange={setFilterStatus} // Actualizar filtro
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
