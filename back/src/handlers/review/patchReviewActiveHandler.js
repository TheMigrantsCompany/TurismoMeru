const  patchReviewActiveController  = require('../../controllers/review/patchReviewActiveController');

const patchReviewActiveHandler = async (req, res) => {
  try {
    const review = await patchReviewActiveController(req.params.id);
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports =  patchReviewActiveHandler ;
