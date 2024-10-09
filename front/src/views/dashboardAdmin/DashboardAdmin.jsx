import React from "react";
import { AdminSideBar } from "../../components/sidebars/admin/AdminSideBar";
import { Outlet } from "react-router-dom";

export function DashboardAdmin() {
    return (
        <div className="flex">
            <AdminSideBar />
            <div className="w-full p-4">
                <Outlet /> {/* Aquí se renderizarán las rutas hijas */}
            </div>
        </div>
    );
}