const getReviewsByServiceTitleController = require('../../controllers/review/getReviewsByServiceTitleController')

const getReviewsByServiceTitleHandler = async (req, res) => {
  const { title } = req.params; // Toma el título del query string
    console.log('title: ', title);
  try {
    const reviews = await getReviewsByServiceTitleController(title);
    res.status(200).json(reviews);
  } catch (error) {
    res.status(404).json({ error: error.message }); // Cambia a 404 si no se encuentra el servicio
  }
};

module.exports = getReviewsByServiceTitleHandler;
