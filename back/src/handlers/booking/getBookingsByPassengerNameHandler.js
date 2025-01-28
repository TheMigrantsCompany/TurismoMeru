const getBookingsByPassengerNameController = require('../../controllers/booking/getBookingsByPassengerNameController');

const getBookingsByPassengerNameHandler = async (req, res) => {
  const { passengerName } = req.params; // Cambiar req.query por req.params

  try {
    if (!passengerName) {
      return res.status(400).json({
        message: 'El parámetro "passengerName" es obligatorio.',
      });
    }

    const bookings = await getBookingsByPassengerNameController(passengerName);

    if (bookings.length === 0) {
      return res.status(404).json({
        message: `No se encontraron reservas para el pasajero "${passengerName}".`,
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

module.exports = getBookingsByPassengerNameHandler;