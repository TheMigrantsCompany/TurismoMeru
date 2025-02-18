import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUsers,
  toggleUserActiveStatus,
  deleteUser,
} from "../../../redux/actions/actions";
import SearchInput from "../../../components/inputs/SearchInput";
import UserTable from "../../../components/tables/admin/UsersTable";
import UserModal from "../../../components/modals/admin-modal/UserModal";
import axios from "axios";

export function UserManagement() {
  const dispatch = useDispatch();
  const userList = useSelector((state) => state.users.userList);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  useEffect(() => {
    let filtered = userList;
    if (filterStatus !== "all") {
      filtered = userList.filter(
        (user) => user.active === (filterStatus === "active")
      );
    }
    setFilteredUsers(filtered);
  }, [userList, filterStatus]);

  const handleSearch = async (query) => {
    if (!query) {
      setFilteredUsers(userList);
      return;
    }

    setSearchLoading(true);

    try {
      let response;
      if (/^\d+$/.test(query)) {
        response = await axios.get(`http://localhost:3001/user/DNI/${query}`);
      } else {
        response = await axios.get(`http://localhost:3001/user/name/${query}`);
      }

      setFilteredUsers(response.data);
    } catch (error) {
      console.error("Error al buscar usuarios:", error);
      setFilteredUsers([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleToggleActive = (id_User) => {
    dispatch(toggleUserActiveStatus(id_User));
  };

  const handleDeleteUser = (id_User) => {
    dispatch(deleteUser(id_User)).then(() => {
      dispatch(getUsers());
    });
  };

  return (
    <div className="container mx-auto p-6 bg-[#f9f3e1] rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-[#4256a6] font-poppins">
        Gestión de Usuarios
      </h1>

      <div className="space-y-6">
        <div className="bg-[#f9f3e1]">
          <div className="mb-6">
            <SearchInput onSearch={handleSearch} type="user" />
          </div>

          {searchLoading ? (
            <div className="text-center py-8">
              <p className="text-[#4256a6] font-poppins text-lg">
                Buscando usuarios...
              </p>
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="bg-[#f9f3e1]">
              <UserTable
                users={filteredUsers}
                onFilterChange={setFilterStatus}
                onViewDetails={setSelectedUser}
                onDelete={handleDeleteUser}
                onToggleActive={handleToggleActive}
              />
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-[#4256a6] font-poppins text-lg">
                No se encontraron usuarios.
              </p>
            </div>
          )}
        </div>
      </div>

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
