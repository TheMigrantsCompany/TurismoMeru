// controllers/bookings/getAllBookingsController.js
const { Booking } = require('../../config/db');

const getAllBookingsController = async () => {
  const bookings = await Booking.findAll();
  return bookings;
};

module.exports = getAllBookingsController;
