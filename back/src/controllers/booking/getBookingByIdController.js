const { Booking } = require('../../config/db'); // Asegúrate de que el modelo está bien importado

const getBookingByIdController = async (id_Booking) => {
    console.log(id_Booking)
  try {
    // Buscar una reserva específica por su ID usando findByPk (clave primaria)
    const booking = await Booking.findByPk(id_Booking);

    if (!booking) {
      throw new Error(`No se encontró ninguna reserva con el id ${id_Booking}`);
    }

    return booking;
  } catch (error) {
    throw new Error(`Error al obtener la reserva: ${error.message}`);
  }
};

module.exports = { getBookingByIdController };
