const  getReviewById  = require('../../controllers/review/getReviewByIdController');

const getReviewByIdHandler = async (req, res) => {
  try {
    const review = await getReviewById(req.params.id);
    if (!review) return res.status(404).json({ error: 'Reseña no encontrada' });
    
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports =  getReviewByIdHandler ;
