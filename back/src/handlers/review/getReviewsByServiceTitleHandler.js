const getReviewsByServiceTitleController = require('../../controllers/review/getReviewsByServiceTitleController');

const getReviewsByServiceTitleHandler = async (req, res) => {
  const { title } = req.params; // Toma el título desde la URL
  try {
    const reviews = await getReviewsByServiceTitleController(title);
    res.status(200).json(reviews);
  } catch (error) {
    res.status(404).json({ error: error.message }); // Si no se encuentran reseñas
  }
};

module.exports = getReviewsByServiceTitleHandler;

