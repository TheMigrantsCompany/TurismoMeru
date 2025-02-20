const { Review } = require('../../config/db');

const getReviewsByUserIdContoller = async (id_User) => {
  
  const reviews = await Review.findAll({
    where: {
      id_User: id_User,
    },
  });
  return reviews;
};

module.exports =  getReviewsByUserIdContoller ;
