const { getBookingByIdController } = require('../../controllers/booking/getBookingByIdController');

const getBookingByIdHandler = async (req, res) => {
  const { id_Booking } = req.params; // Obtenemos el id_Booking de los parámetros de la URL

  if (!id_Booking) {
    return res.status(400).json({ message: 'El id_Booking es requerido' });
  }

  try {
    const booking = await getBookingByIdController(id_Booking);
    return res.status(200).json(booking); // Enviamos la reserva encontrada
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = getBookingByIdHandler;
