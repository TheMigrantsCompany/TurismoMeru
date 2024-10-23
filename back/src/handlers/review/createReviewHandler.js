const  createReviewController  = require('../../controllers/review/createReviewController');

const createReviewHandler = async (req, res) => {
  try {
    const newReview = await createReviewController(req.body);
    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports =  createReviewHandler ;
