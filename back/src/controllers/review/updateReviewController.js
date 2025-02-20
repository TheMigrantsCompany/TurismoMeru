const {Review} = require('../../config/db');

const updateReviewController = async (id, updateData) => {
  const review = await Review.findByPk(id);
  if (!review) throw new Error('Reseña no encontrada');
  
  await review.update(updateData);
  
  return review;
};

module.exports =  updateReviewController ;
