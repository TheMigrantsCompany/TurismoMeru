const { Booking } = require('../../config/db');

const getBookingsByUserIdController = async (userId) => {
  const bookings = await Booking.findAll({
    where: {
      userId: userId
    }
  });

  return bookings;
};

module.exports = getBookingsByUserIdController;
