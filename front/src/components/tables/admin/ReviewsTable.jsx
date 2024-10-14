import React from 'react';
import { Button, IconButton } from '@material-tailwind/react';
import { PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ReviewsTable = ({ reviews, onReviewStatusChange, onViewDetails }) => {
  return (
    <table className="text-center min-w-full border-collapse border border-gray-200">
      <thead>
        <tr className="bg-gray-100">
          <th className="text-gray-900">Usuario</th>
          <th className="text-gray-900">Puntuación</th>
          <th className="text-gray-900">Comentario</th>
          <th className="text-gray-900">Estado</th>
          <th className="text-gray-900">Fecha</th>
          <th className="text-gray-900">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {reviews.map((review) => (
          <tr key={review.id}>
            <td className="text-gray-900">{review.user}</td>
            <td className="text-gray-900">{review.rating}</td>
            <td className="text-gray-900">{review.comment}</td>
            <td className="text-gray-900">
              {review.status === 'approved' ? (
                <span className="text-green-500">Aprobada</span>
              ) : (
                <span className="text-yellow-500">Pendiente</span>
              )}
            </td>
            <td className="text-gray-900">{review.date}</td>
            <td className="flex justify-center gap-2">
              <IconButton onClick={() => onReviewStatusChange(review.id, 'approved')}>
                <CheckIcon className="h-5 w-5 text-green-500" />
              </IconButton>
              <IconButton onClick={() => onReviewStatusChange(review.id, 'rejected')}>
                <XMarkIcon className="h-5 w-5 text-red-500" />
              </IconButton>
              <IconButton onClick={() => onViewDetails(review)}>
                <PencilIcon className="h-5 w-5 text-blue-500" />
              </IconButton>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ReviewsTable;
