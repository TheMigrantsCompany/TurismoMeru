import React, { useState } from 'react';
import { Rating } from '@material-tailwind/react';
import { motion } from 'framer-motion';
import axios from 'axios';

const Review = ({ excursionTitle, excursionPhoto, idService, idUser }) => {
  const [name, setName] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/review/', {
        id_User: idUser,
        id_Service: idService,
        content: review,
        rating,
      });

      if (response.status === 201) {
        setSubmitted(true);
        console.log('Reseña guardada:', response.data);
      }
    } catch (err) {
      setError('Hubo un problema al guardar la reseña. Inténtalo de nuevo.');
      console.error('Error al guardar la reseña:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row items-center md:items-start p-4 bg-white rounded-lg shadow-lg space-y-4 md:space-y-0 md:space-x-4 max-w-2xl mx-auto"
    >
      
      <div className="w-40 h-40 md:w-44 md:h-44 rounded-lg overflow-hidden shadow-md">
        <img
          src={excursionPhoto}
          alt={excursionTitle}
          className="w-full h-full object-cover"
        />
      </div>

      
      <div className="flex-1 flex flex-col items-center md:items-start">
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4 w-full flex flex-col items-center">
           
            <h2 className="text-lg font-semibold text-gray-800 mb-2 text-center md:text-left">{excursionTitle}</h2>

            
            <div className="flex flex-col w-full max-w-sm">
              <label className="text-sm font-medium text-gray-600 mb-1">Nombre:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
                placeholder="Tu nombre"
                required
              />
            </div>

            
            <div className="flex flex-col w-full max-w-sm">
              <label className="text-sm font-medium text-gray-600 mb-1">Reseña:</label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm resize-none"
                placeholder="Escribe tu opinión aquí"
                required
              ></textarea>
            </div>
            <div className="flex items-center space-x-3 w-full max-w-sm">
              <label className="text-sm font-medium text-gray-600">Calificación:</label>
              <Rating value={rating} onChange={setRating} className="scale-110" />
            </div>
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
            <motion.button
              whileHover={{ scale: 1.05 }}
              type="submit"
              className="w-32 bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
            >
              Enviar Reseña
            </motion.button>
          </form>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <h2 className="text-lg font-semibold text-blue-600 mb-2">
              ¡Gracias por tu reseña!
            </h2>
            <p className="text-sm text-gray-700">
              Has calificado <span className="font-bold">{excursionTitle}</span> con {rating} estrellas.
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Review;
