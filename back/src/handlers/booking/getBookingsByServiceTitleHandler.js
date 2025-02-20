const getBookingsByServiceTitleController = require('../../controllers/booking/getBookingsByServiceTitleController');

const getBookingsByServiceTitleHandler = async (req, res) => {
  const { serviceTitle } = req.params; // Cambiado a params

  try {
    if (!serviceTitle) {
      return res.status(400).json({
        message: 'El parámetro "serviceTitle" es obligatorio.',
      });
    }

    const bookings = await getBookingsByServiceTitleController(serviceTitle);

    if (bookings.length === 0) {
      return res.status(404).json({
        message: `No se encontraron reservas para la excursión "${serviceTitle}".`,
      });
    }

    res.status(200).json({
      message: 'Reservas encontradas exitosamente.',
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener las reservas.',
      error: error.message,
    });
  }
};

module.exports = getBookingsByServiceTitleHandler;
