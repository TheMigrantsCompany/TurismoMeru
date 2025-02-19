import React from "react";
import { AdminSideBar } from "../../components/sidebars/admin/AdminSideBar";
import { Outlet } from "react-router-dom";

export function DashboardAdmin() {
  return (
    <div className="flex min-h-screen bg-[#dac9aa]">
      <div className="fixed">
        <AdminSideBar />
      </div>
      <div className="flex-1 ml-[20rem] p-6">
        <Outlet />
      </div>
    </div>
  );
}
