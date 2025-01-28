const { Booking } = require('../../config/db'); // Importa el modelo Booking
const { Op } = require('sequelize'); // Importa Op para las operaciones de comparación

const updateBookingController = async (id_Booking, updateData) => {
  // Verifica si el id_Booking es válido
  const booking = await Booking.findByPk(id_Booking);
  if (!booking) {
    throw new Error('Reserva no encontrada');
  }

  // Si se intenta actualizar el seatNumber, valida que no esté ya en uso
  if (updateData.seatNumber) {
    const existingBooking = await Booking.findOne({
      where: {
        seatNumber: updateData.seatNumber,
        id_Service: booking.id_Service, // Asegúrate de que el servicio coincida
        id_Booking: { [Op.ne]: id_Booking }, // Excluye la reserva actual
      },
    });

    if (existingBooking) {
      throw new Error('El número de asiento ya está en uso para este servicio.');
    }
  }

  // Si se intenta actualizar el DNI o el nombre del pasajero
  if (updateData.DNI || updateData.passengerName) {
    if (!updateData.DNI || !updateData.passengerName) {
      throw new Error('Es necesario proporcionar tanto el DNI como el nombre del pasajero.');
    }
  }

  // Actualiza la reserva con los nuevos datos
  await booking.update(updateData);

  // Retorna la reserva actualizada
  return booking;
};

module.exports = updateBookingController;