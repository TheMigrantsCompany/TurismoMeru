const { Review } = require('../../config/db');

const deleteReviewController = async (id) => {
  const review = await Review.findByPk(id);
  if (!review) throw new Error('Reseña no encontrada');
  
  await review.destroy();
  
  return review;
};

module.exports =  deleteReviewController ;
