const getBookingsByUserIdController = require('../../controllers/booking/getBookingsByUserIdController');

const getBookingsByUserIdHandler = async (req, res) => {
  const { userId } = req.params;

  try {
    const bookings = await getBookingsByUserIdController(userId);
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las reservas', error: error.message });
  }
};

module.exports = getBookingsByUserIdHandler;
