const { Booking, sequelize } = require('../../config/db'); // Importa sequelize

const getBookingsByServiceTitleController = async (serviceTitle) => {
  // Normaliza el título ingresado a minúsculas
  const normalizedTitle = serviceTitle.toLowerCase();

  const bookings = await Booking.findAll({
    where: {
      // Normaliza el 'serviceTitle' almacenado para comparar
      serviceTitle: sequelize.where(
        sequelize.fn('LOWER', sequelize.col('serviceTitle')),
        normalizedTitle
      )
    }
  });

  return bookings;
};

module.exports = getBookingsByServiceTitleController;
