const { Review, Service, User } = require('../../config/db');

const createReviewController = async (reviewData) => {
  // Verifica si el servicio existe
  const service = await Service.findOne({ where: { id_Service: reviewData.serviceId } });
  if (!service) {
    throw new Error('Servicio no encontrado');
  }

  // Verifica si el usuario existe
  const user = await User.findOne({ where: { id_User: reviewData.userId } }); // Cambiado a id_User
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  const serviceTitle = service.title;

  // Crea la reseña
  const newReview = await Review.create({
    ...reviewData,
    serviceTitle // Si deseas incluir el título en la reseña
  });

  return newReview;
};

module.exports = createReviewController;
