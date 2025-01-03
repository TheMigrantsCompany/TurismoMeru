const { Op } = require('sequelize');
const { Review } = require('../../config/db'); // No es necesario importar `Service` si estamos utilizando `serviceTitle` en `Review`

const getReviewsByServiceTitle = async (title) => {
  // Buscar reseñas por el título del servicio (en `serviceTitle`)
  const reviews = await Review.findAll({
    where: {
      serviceTitle: {
        [Op.iLike]: title // Esto asegura que la búsqueda no distinga entre mayúsculas y minúsculas (funciona para PostgreSQL)
      }
    }
  });

  if (reviews.length === 0) {
    throw new Error('No se encontraron reseñas para este título de servicio');
  }

  return reviews;
};

module.exports = getReviewsByServiceTitle;
