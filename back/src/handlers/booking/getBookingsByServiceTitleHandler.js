const getBookingsByServiceTitleController = require('../../controllers/booking/getBookingsByServiceTitleController');

const getBookingsByServiceTitleHandler = async (req, res) => {
  const { serviceTitle } = req.params; // Toma el parámetro del título
    console.log(serviceTitle)
  try {
    const bookings = await getBookingsByServiceTitleController(serviceTitle);
    if (bookings.length === 0) {
      return res.status(404).json({ message: 'No se encontraron reservas para la excursión especificada.' });
    }
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las reservas', error: error.message });
  }
};

module.exports = getBookingsByServiceTitleHandler;
