const { Review } = require('../../config/db');

const getReviewsByUserIdContoller = async (userId) => {
  
  const reviews = await Review.findAll({
    where: {
      userId,
    },
  });
  return reviews;
};

module.exports =  getReviewsByUserIdContoller ;
