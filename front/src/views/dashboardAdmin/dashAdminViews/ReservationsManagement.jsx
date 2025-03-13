import React, { useState } from "react";
import { ReservationsTable } from "../../../components/tables/admin/Reservations";

export function ReservationsManagement() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="container mx-auto p-6 bg-[#f9f3e1] rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-[#4256a6] font-poppins">
        Gestión de Reservas
      </h1>

      <div className="space-y-6">
        <div className="bg-[#f9f3e1]">
          <ReservationsTable
            onRefresh={handleRefresh}
            refreshTrigger={refreshTrigger}
          />
        </div>
      </div>
    </div>
  );
}
