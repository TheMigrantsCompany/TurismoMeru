const { Review, Service, User } = require('../../config/db');

const createReviewController = async (reviewData) => {
  const { id_Service, id_User, content, rating } = reviewData;

  // Verifica si el servicio existe
  const service = await Service.findByPk(id_Service);
  if (!service) {
    throw new Error('Servicio no encontrado');
  }

  // Verifica si el usuario existe
  const user = await User.findByPk(id_User);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  // Incluye el título del servicio en la reseña
  const serviceTitle = service.title;

  // Crea la reseña
  const newReview = await Review.create({
    id_Service,
    id_User,
    content,
    rating,
    serviceTitle,
  });

  return newReview;
};

module.exports = createReviewController;
