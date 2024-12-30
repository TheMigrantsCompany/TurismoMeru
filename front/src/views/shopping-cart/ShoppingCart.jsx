import React, { useState, useEffect } from "react";
import { IconButton } from "@material-tailwind/react";
import { CheckIcon, XMarkIcon, PencilIcon } from '@heroicons/react/24/outline';

const ReviewsTable = ({ reviews, onReviewStatusChange, onViewDetails }) => {
  const [userMap, setUserMap] = useState({});
  const [loadingReviewId, setLoadingReviewId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3001/user");
        if (!response.ok) throw new Error('Error al cargar los usuarios');
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
    <div className="rounded-lg bg-white shadow-lg p-6">
      <h5 className="text-xl font-semibold text-[#4256a6]">Gestión de Reseñas</h5>

      <div className="overflow-x-auto mt-6">
        <table className="min-w-full table-auto text-left border-collapse border border-[#425a66]">
          <thead className="bg-[#f9f3e1]">
            <tr>
              <th className="p-4 text-sm font-medium text-[#4256a6] border-b border-[#425a66]">Usuario</th>
              <th className="p-4 text-sm font-medium text-[#4256a6] border-b border-[#425a66]">Puntuación</th>
              <th className="p-4 text-sm font-medium text-[#4256a6] border-b border-[#425a66]">Comentario</th>
              <th className="p-4 text-sm font-medium text-[#4256a6] border-b border-[#425a66]">Estado</th>
              <th className="p-4 text-sm font-medium text-[#4256a6] border-b border-[#425a66]">Fecha</th>
              <th className="p-4 text-sm font-medium text-[#4256a6] border-b border-[#425a66]">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <tr key={review.id_Review} className="border-b border-[#425a66]">
                  <td className="p-4 text-sm text-[#4256a6]">{userMap[review.id_User] || 'Desconocido'}</td>
                  <td className="p-4 text-sm text-[#4256a6]">{review.rating || 'Sin puntuación'}</td>
                  <td className="p-4 text-sm text-[#4256a6]">{review.content || 'Sin comentario'}</td>
                  <td className="p-4 text-sm text-[#4256a6]">
                    {review.active ? (
                      <span className="text-green-500">Activa</span>
                    ) : (
                      <span className="text-yellow-500">Inactiva</span>
                    )}
                  </td>
                  <td className="p-4 text-sm text-[#4256a6]">
                    {review.createdAt
                      ? new Date(review.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'Fecha no disponible'}
                  </td>
                  <td className="p-4 flex justify-center gap-2">
                    <IconButton
                      onClick={async () => {
                        setLoadingReviewId(review.id_Review);
                        await onReviewStatusChange(review.id_Review, 'approved');
                        setLoadingReviewId(null);
                      }}
                      disabled={loadingReviewId === review.id_Review}
                    >
                      <CheckIcon className={`h-5 w-5 ${loadingReviewId === review.id_Review ? 'text-gray-400' : 'text-green-500'}`} />
                    </IconButton>
                    <IconButton
                      onClick={async () => {
                        setLoadingReviewId(review.id_Review);
                        await onReviewStatusChange(review.id_Review, 'rejected');
                        setLoadingReviewId(null);
                      }}
                      disabled={loadingReviewId === review.id_Review}
                    >
                      <XMarkIcon className={`h-5 w-5 ${loadingReviewId === review.id_Review ? 'text-gray-400' : 'text-red-500'}`} />
                    </IconButton>
                    <IconButton onClick={() => onViewDetails(review, userMap)}>
                      <PencilIcon className="h-5 w-5 text-[#4256a6]" />
                    </IconButton>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-4 text-center text-[#4256a6]">
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
