const getBookingsByUserIdController = require('../../controllers/booking/getBookingsByUserIdController');

const getBookingsByUserIdHandler = async (req, res) => {
  const { id_User } = req.params;

  try {
    const bookings = await getBookingsByUserIdController(id_User);
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las reservas', error: error.message });
  }
};

module.exports = getBookingsByUserIdHandler;
