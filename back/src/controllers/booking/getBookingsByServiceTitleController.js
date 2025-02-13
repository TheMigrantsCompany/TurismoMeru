const { Booking, sequelize } = require('../../config/db');

const getBookingsByServiceTitleController = async (serviceTitle) => {
  if (!serviceTitle) {
    throw new Error('El título del servicio es obligatorio.');
  }

  const normalizedTitle = serviceTitle.toLowerCase();

  const bookings = await Booking.findAll({
    where: {
      serviceTitle: sequelize.where(
        sequelize.fn('LOWER', sequelize.col('serviceTitle')),
        normalizedTitle
      ),
    },
  });

  return bookings;
};

module.exports = getBookingsByServiceTitleController;