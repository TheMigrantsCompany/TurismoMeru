import React from 'react';

const ReviewModal = ({ review, userMap, onClose }) => {
  if (!review) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000cc] pointer-events-auto">
      <div className="bg-[#dac9aa] p-6 rounded-lg max-w-lg w-full relative z-10 overflow-y-auto max-h-[90vh] shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-[#152817]">Detalles de la Review</h2>
        
        {/* Información básica de la review */}
        <div className="space-y-4">
          <div>
            <label className="block font-bold text-[#152817]">Usuario:</label>
            <p className="text-[#4256a6]">{review.user || 'Desconocido'}</p>
          </div>

          <div>
            <label className="block font-bold text-[#152817]">Excursión:</label>
            <p className="text-[#4256a6]">{review.serviceTitle || 'Sin título'}</p>
          </div>

          <div>
            <label className="block font-bold text-[#152817]">Puntuación:</label>
            <p className="text-[#4256a6]">{review.rating || 'Sin puntuación'}</p>
          </div>

          <div>
            <label className="block font-bold text-[#152817]">Comentario:</label>
            <p className="text-[#4256a6]">{review.content || 'Sin comentario'}</p>
          </div>

          <div>
            <label className="block font-bold text-[#152817]">Estado:</label>
            <p className={`font-medium ${review.active ? 'text-[#52b14e]' : 'text-[#f4925b]'}`}>
              {review.active ? 'Aprobada' : 'Pendiente'}
            </p>
          </div>

          <div>
            <label className="block font-bold text-[#152817]">Fecha de Creación:</label>
            <p className="text-[#4256a6]">
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
            className="py-2 px-4 bg-[#4256a6] text-white rounded-lg hover:bg-[#364d73] transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
