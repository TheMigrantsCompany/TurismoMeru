const { Booking, sequelize } = require('../../config/db');
const { Op } = require('sequelize');

const getBookingsByServiceTitleController = async (serviceTitle) => {
  if (!serviceTitle) {
    throw new Error('El título del servicio es obligatorio.');
  }

  const normalizedTitle = serviceTitle.toLowerCase();

  const bookings = await Booking.findAll({
    where: {
      serviceTitle: sequelize.where(
        sequelize.fn('LOWER', sequelize.col('serviceTitle')), // Convertimos el campo 'serviceTitle' a minúsculas
        {
          [Op.like]: `%${normalizedTitle}%`, // Búsqueda parcial, sin importar mayúsculas/minúsculas
        }
      ),
    },
  });

  return bookings;
};

module.exports = getBookingsByServiceTitleController;