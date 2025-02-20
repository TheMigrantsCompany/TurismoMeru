const { Review } = require('../../config/db');

const patchReviewActiveController = async (id) => {
  const review = await Review.findByPk(id);
  if (!review) throw new Error('Reseña no encontrada');
  
  review.active =(!review.active) ; // Aprobando la reseña
  await review.save();
  
  return review;
};

module.exports =  patchReviewActiveController ;
