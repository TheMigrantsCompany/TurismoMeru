import React, { useState } from 'react';
import SearchInput from '../../../components/inputs/SearchInput';
import UserTable from '../../../components/tables/admin/UsersTable';
import UserModal from '../../../components/modals/admin-modal/UserModal'; // Modal similar al de reservas

const initialUsers = [
    { 
      id: 1, 
      name: 'Juan Pérez', 
      document: '12345678', 
      email: 'juan@example.com', 
      active: true, 
      excursions: [
        { name: "Excursión A", status: "aceptada" },
        { name: "Excursión B", status: "pendiente" },
      ]
    },
    { 
      id: 2, 
      name: 'María López', 
      document: '87654321', 
      email: 'maria@example.com', 
      active: false,
      excursions: []
    },
    // Más usuarios aquí
  ];
export function UserManagement() {
  const [users, setUsers] = useState(initialUsers);
  const [filteredUsers, setFilteredUsers] = useState(initialUsers);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleSearch = (query) => {
    const lowercasedQuery = query.toLowerCase();
    setFilteredUsers(users.filter(user => 
      user.name.toLowerCase().includes(lowercasedQuery) || 
      user.document.includes(lowercasedQuery)
    ));
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
  };

  const handleToggleActive = (isActive) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === selectedUser.id ? { ...user, active: isActive } : user
      )
    );
  };

  const handleSaveUser = (updatedUser) => {
    setUsers(prevUsers => 
      prevUsers.map(user => (user.id === updatedUser.id ? updatedUser : user))
    );
    setSelectedUser(null);
  };

  return (
    <div className="top-5 gap-5 flex flex-col w-full h-full">
      <SearchInput onSearch={handleSearch} />
      <h2 className="text-xl text-black font-semibold mb-4">Gestión de Usuarios</h2>
      <UserTable users={filteredUsers} onEdit={handleEditUser} />
      {selectedUser && (
        <UserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onToggleActive={isActive => handleToggleActive(selectedUser.id, isActive)}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
}
