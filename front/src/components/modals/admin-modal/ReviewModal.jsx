import React from 'react';

const ReviewModal = ({ review, userMap, onClose }) => {
  if (!review) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75 pointer-events-auto">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full relative z-10 overflow-y-auto max-h-[90vh] shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">Detalles de la Review</h2>
        
        {/* Información básica de la review */}
        <div className="space-y-4">
          <div>
            <label className="block font-bold text-gray-800">Usuario:</label>
            <p className="text-gray-600">{review.user || 'Desconocido'}</p>
          </div>

          <div>
            <label className="block font-bold text-gray-800">Excursión:</label>
            <p className="text-gray-600">{review.serviceTitle || 'Sin título'}</p>
          </div>

          <div>
            <label className="block font-bold text-gray-800">Puntuación:</label>
            <p className="text-gray-600">{review.rating || 'Sin puntuación'}</p>
          </div>

          <div>
            <label className="block font-bold text-gray-800">Comentario:</label>
            <p className="text-gray-600">{review.content || 'Sin comentario'}</p>
          </div>

          <div>
            <label className="block font-bold text-gray-800">Estado:</label>
            <p className={`font-medium ${review.active ? 'text-green-600' : 'text-yellow-600'}`}>
              {review.active ? 'Aprobada' : 'Pendiente'}
            </p>
          </div>

          <div>
            <label className="block font-bold text-gray-800">Fecha de Creación:</label>
            <p className="text-gray-600">
              {review.createdAt
                ? new Date(review.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'Fecha no disponible'}
            </p>
          </div>
        </div>

        {/* Botón de cerrar */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
