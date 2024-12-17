const { Op } = require('sequelize'); // Asegúrate de importar Op
const { Review, Service } = require('../../config/db');

const getReviewsByServiceTitle = async (title) => {
  // Busca el servicio por título sin importar mayúsculas/minúsculas
  const service = await Service.findOne({
    where: {
      title: {
        [Op.iLike]: title // Para PostgreSQL; usa 'like' para otros motores
      }
    }
  });
  
  if (!service) {
    throw new Error('Servicio no encontrado');
  }

  // Busca las reseñas que correspondan al id del servicio encontrado
  const reviews = await Review.findAll({ where: { id_Service: service.id_Service } });
  
  return reviews;
};

module.exports = getReviewsByServiceTitle;
