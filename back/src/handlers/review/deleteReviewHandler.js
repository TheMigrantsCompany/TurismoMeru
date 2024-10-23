const  deleteReview  = require('../../controllers/review/deleteReviewController');

const deleteReviewHandler = async (req, res) => {
  try {
    await deleteReview(req.params.id);
    return res.status(200).json({
        message: 'Reseña eliminada exitosamente',
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = deleteReviewHandler ;
