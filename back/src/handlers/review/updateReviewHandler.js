const  updateReviewController = require('../../controllers/review/updateReviewController');

const updateReviewHandler = async (req, res) => {
  try {
    const {id} = req.params;
    const updateData = req.body;
    const updatedReview = await updateReviewController(id, updateData);
    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = updateReviewHandler ;
