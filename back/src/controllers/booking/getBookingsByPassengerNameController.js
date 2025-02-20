const { Booking, sequelize } = require('../../config/db');
const { Op } = require('sequelize');

const getBookingsByPassengerNameController = async (passengerName) => {
  if (!passengerName) {
    throw new Error('El nombre del pasajero es obligatorio.');
  }

  const normalizedName = passengerName.toLowerCase();

  const bookings = await Booking.findAll({
    where: {
      passengerName: sequelize.where(
        sequelize.fn('LOWER', sequelize.col('passengerName')),
        {
          [Op.like]: `%${normalizedName}%`, // Búsqueda parcial
        }
      ),
    },
  });

  return bookings;
};

module.exports = getBookingsByPassengerNameController;