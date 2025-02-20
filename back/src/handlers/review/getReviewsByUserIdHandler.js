const  getReviewsByUserIdContoller  = require('../../controllers/review/getReviewsByUserIdController');

const getReviewsByUserIdHandler = async (req, res) => {
    const { id_User } = req.params;
    console.log('id_User', id_User);
  try {
    const reviews = await getReviewsByUserIdContoller(id_User);
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports =  getReviewsByUserIdHandler ;
