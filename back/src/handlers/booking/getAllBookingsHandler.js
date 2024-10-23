// handlers/bookings/getAllBookingsHandler.js
const getAllBookingsController = require('../../controllers/booking/getAllBookingsController');

const getAllBookingsHandler = async (req, res) => {
  try {
    const bookings = await getAllBookingsController();
    if (bookings.length === 0) {
      return res.status(404).json({ message: 'No se encontraron reservas.' });
    }

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las reservas.', error: error.message });
  }
};

module.exports = getAllBookingsHandler;
