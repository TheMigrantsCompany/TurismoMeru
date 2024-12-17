const createBookingController = require('../../controllers/booking/createBookingController');

// Handler para crear una reserva
const createBookingHandler = async (bookingData) => {
  const { id_User, paymentStatus, paymentInformation, id_ServiceOrder } = bookingData;

  try {
    const bookings = await createBookingController(id_User, paymentStatus, paymentInformation, id_ServiceOrder);
    return { message: 'Reserva(s) creada(s) exitosamente.', bookings }; // Devuelve la respuesta
  } catch (error) {
    throw new Error(error.message); // Lanza un error para manejarlo más tarde
  }
};

module.exports = createBookingHandler;
