import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, toggleUserActiveStatus, deleteUser } from "../../../redux/actions/actions";
import SearchInput from "../../../components/inputs/SearchInput";
import UserTable from "../../../components/tables/admin/UsersTable";
import UserModal from "../../../components/modals/admin-modal/UserModal";
import axios from "axios";

export function UserManagement() {
  const dispatch = useDispatch();
  const userList = useSelector((state) => state.users.userList);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all"); // Estado para filtro
  const [searchLoading, setSearchLoading] = useState(false); // Estado para mostrar cargando

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
  const handleSearch = async (query) => {
    if (!query) {
      // Si no hay búsqueda, mostrar todos los usuarios
      setFilteredUsers(userList);
      return;
    }

    setSearchLoading(true);

    try {
      let response;
      if (/^\d+$/.test(query)) {
        // Si el query son solo números, buscar por DNI
        response = await axios.get(`http://localhost:3001/user/DNI/${query}`);
      } else {
        // Si no, buscar por nombre
        response = await axios.get(`http://localhost:3001/user/name/${query}`);
      }

      setFilteredUsers(response.data);
    } catch (error) {
      console.error("Error al buscar usuarios:", error);
      setFilteredUsers([]); // Limpiar la lista si ocurre un error
    } finally {
      setSearchLoading(false);
    }
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
    <div className="top-5 gap-5 flex flex-col w-full h-full p-6 bg-[#f9f3e1]">
      <h2 className="text-2xl text-[#4256a6] font-semibold mb-4">Gestión de Usuarios</h2>
      <SearchInput onSearch={handleSearch} />
      {searchLoading ? (
        <p className="text-[#4256a6] text-center">Buscando...</p>
      ) : (
        <UserTable
          users={filteredUsers}
          onFilterChange={setFilterStatus} // Actualizar filtro
          onViewDetails={setSelectedUser}
          onDelete={handleDeleteUser}
          onToggleActive={handleToggleActive}
        />
      )}
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
