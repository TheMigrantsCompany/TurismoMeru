import React, { useState, useEffect } from 'react';
import { IconButton } from "@material-tailwind/react";
import { CheckIcon, XMarkIcon, PencilIcon } from '@heroicons/react/24/outline';

const ReviewsTable = ({ reviews, onReviewStatusChange, onViewDetails }) => {
  const [userMap, setUserMap] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("http://localhost:3001/user"); 
      const users = await response.json();
      const map = users.reduce((acc, user) => {
        acc[user.id_User] = user.name;
        return acc;
      }, {});
      setUserMap(map);
    };

    fetchUsers();
  }, []);

  return (
    <table className="text-center min-w-full border-collapse border border-gray-200">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 text-gray-900">Usuario</th>
          <th className="p-2 text-gray-900">Puntuación</th>
          <th className="p-2 text-gray-900">Comentario</th>
          <th className="p-2 text-gray-900">Estado</th>
          <th className="p-2 text-gray-900">Fecha</th>
          <th className="p-2 text-gray-900">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <tr key={review.id_Review}>
              <td className="p-2 text-gray-900">{userMap[review.id_User] || 'Desconocido'}</td>
              <td className="p-2 text-gray-900">{review.rating || 'Sin puntuación'}</td>
              <td className="p-2 text-gray-900">{review.content || 'Sin comentario'}</td>
              <td className="p-2 text-gray-900">
                {review.active ? (
                  <span className="text-green-500">Activa</span>
                ) : (
                  <span className="text-yellow-500">Inactiva</span>
                )}
              </td>
              <td className="p-2 text-gray-900">
                {new Date(review.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </td>
              <td className="p-2 flex justify-center gap-2">
                <IconButton onClick={() => onReviewStatusChange(review.id_Review, 'approved')}>
                  <CheckIcon className="h-5 w-5 text-green-500" />
                </IconButton>
                <IconButton onClick={() => onReviewStatusChange(review.id_Review, 'rejected')}>
                  <XMarkIcon className="h-5 w-5 text-red-500" />
                </IconButton>
                <IconButton onClick={() => onViewDetails(review)}>
                  <PencilIcon className="h-5 w-5 text-blue-500" />
                </IconButton>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="p-4 text-gray-900">
              No se encontraron reseñas.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default ReviewsTable;