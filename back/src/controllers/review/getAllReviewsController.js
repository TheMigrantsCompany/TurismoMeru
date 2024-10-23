const { Review } = require('../../config/db.js');

const getAllReviewsController = async () => {
  const reviews = await Review.findAll();
  return reviews;
};

module.exports =  getAllReviewsController;
