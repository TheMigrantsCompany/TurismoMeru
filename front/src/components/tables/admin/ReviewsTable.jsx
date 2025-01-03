import React, { useState, useEffect } from "react";
import { IconButton } from "@material-tailwind/react";
import { CheckIcon, XMarkIcon, PencilIcon } from "@heroicons/react/24/outline";

const ReviewsTable = ({ reviews, onReviewStatusChange, onViewDetails }) => {
  const [userMap, setUserMap] = useState({});
  const [loadingReviewId, setLoadingReviewId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3001/user");
        if (!response.ok) throw new Error("Error al cargar los usuarios");
        const users = await response.json();
        const map = users.reduce((acc, user) => {
          acc[user.id_User] = user.name;
          return acc;
        }, {});
        setUserMap(map);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="rounded-lg bg-[#f9f3e1] shadow-lg p-6">
      <div className="overflow-x-auto mt-6">
        <table className="w-full table-auto text-left">
          <thead>
            <tr className="bg-[#f0f5fc]">
              {["Usuario", "Título de Excursión", "Puntuación", "Comentario", "Estado", "Fecha", "Acciones"].map(
                (header) => (
                  <th
                    key={header}
                    className="p-4 text-sm font-medium text-[#4256a6] border-b border-[#4256a6]"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <tr
                  key={review.id_Review}
                  className="hover:bg-[#e1d4b0] transition-colors border-b border-[#4256a6]"
                >
                  <td className="p-4 text-sm text-[#4256a6]">
                    {userMap[review.id_User] || "Desconocido"}
                  </td>
                  <td className="p-4 text-sm text-[#4256a6]">
                    {review.serviceTitle || "Sin título"}
                  </td>
                  <td className="p-4 text-sm text-[#4256a6]">
                    {review.rating || "Sin puntuación"}
                  </td>
                  <td className="p-4 text-sm text-[#4256a6]">
                    {review.content || "Sin comentario"}
                  </td>
                  <td className="p-4 text-sm">
                    <span
                      className={`font-semibold ${
                        review.active ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {review.active ? "Activa" : "Inactiva"}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-[#4256a6]">
                    {review.createdAt
                      ? new Date(review.createdAt).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Fecha no disponible"}
                  </td>
                  <td className="p-4 flex justify-center gap-2">
                    <IconButton
                      onClick={async () => {
                        setLoadingReviewId(review.id_Review);
                        await onReviewStatusChange(review.id_Review, "approved");
                        setLoadingReviewId(null);
                      }}
                      disabled={loadingReviewId === review.id_Review}
                      className="bg-[#4256a6] hover:bg-[#364d73]"
                    >
                      <CheckIcon className="h-5 w-5 text-white" />
                    </IconButton>
                    <IconButton
                      onClick={async () => {
                        setLoadingReviewId(review.id_Review);
                        await onReviewStatusChange(review.id_Review, "rejected");
                        setLoadingReviewId(null);
                      }}
                      disabled={loadingReviewId === review.id_Review}
                      className="bg-[#f4925b] hover:bg-[#d98248]"
                    >
                      <XMarkIcon className="h-5 w-5 text-white" />
                    </IconButton>
                    <IconButton
                      onClick={() => onViewDetails(review, userMap)}
                      className="bg-[#152817] hover:bg-[#0f1e11]"
                    >
                      <PencilIcon className="h-5 w-5 text-white" />
                    </IconButton>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-4 text-center text-[#4256a6]">
                  No se encontraron reseñas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReviewsTable;
