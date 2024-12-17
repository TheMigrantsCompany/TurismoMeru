const { Booking } = require('../../config/db');

const getBookingsByUserIdController = async (id_User) => {
  const bookings = await Booking.findAll({
    where: {
      id_User,
    }
  });

  return bookings;
};

module.exports = getBookingsByUserIdController;
