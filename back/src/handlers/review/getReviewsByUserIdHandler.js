const  getReviewsByUserIdContoller  = require('../../controllers/review/getReviewsByUserIdController');

const getReviewsByUserIdHandler = async (req, res) => {
    const { userId } = req.params;
    console.log('userId', userId);
  try {
    const reviews = await getReviewsByUserIdContoller(userId);
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports =  getReviewsByUserIdHandler ;
