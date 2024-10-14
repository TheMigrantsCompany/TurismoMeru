import React from "react";
import { UserSideBar } from "../../components/sidebars/user/UserSideBar";
import { Outlet } from 'react-router-dom';

export function DashboardUser() {
  return (
    <div className="flex">
      <UserSideBar />
      <div className="flex-grow p-4">
        <Outlet /> {/* Esto renderizará las rutas anidadas */}
      </div>
    </div>
  );
}