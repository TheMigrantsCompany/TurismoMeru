const { Review } = require('../../config/db');

const getReviewByIdController = async (id) => {
  const review = await Review.findByPk(id);
  return review;
};

module.exports =  getReviewByIdController ;
