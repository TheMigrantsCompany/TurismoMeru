const { Booking } = require('../../config/db'); // Importa el modelo Booking

const deleteBookingController = async (id_Booking) => {
  // Busca la reserva por ID
  const booking = await Booking.findByPk(id_Booking);
  if (!booking) {
    throw new Error('Reserva no encontrada');
  }

  // Elimina la reserva
  await booking.destroy();
};

module.exports = deleteBookingController;
