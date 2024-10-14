import React from 'react';

const ReviewModal = ({ review, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75 pointer-events-auto">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full relative z-10 overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold mb-4 text-black">Detalles de la Review</h2>
        
        {/* Información básica de la review */}
        <div className="mb-4">
          <label className="block font-bold text-gray-800">Usuario:</label>
          <p className="text-gray-800">{review.user}</p>
        </div>

        <div className="mb-4">
          <label className="block font-bold text-gray-800">Puntuación:</label>
          <p className="text-gray-800">{review.rating}</p>
        </div>

        <div className="mb-4">
          <label className="block font-bold text-gray-800">Comentario:</label>
          <p className="text-gray-800">{review.comment}</p>
        </div>

        <div className="flex justify-between">
          <button onClick={onClose} className="p-2 border rounded bg-gray-300">Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
