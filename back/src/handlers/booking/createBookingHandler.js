const createBookingController = require('../../controllers/booking/createBookingController');

const createBookingHandler = async (bookingData) => {
  console.log("[Handler] Datos recibidos en createBookingHandler:", bookingData);
  
  try {
    const bookings = await createBookingController(
      bookingData.id_User,
      bookingData.paymentStatus,
      bookingData.paymentInformation,
      bookingData.id_ServiceOrder,
      bookingData.DNI
    );

    console.log("[Handler] Reservas creadas exitosamente:", bookings);

    return { message: 'Reserva(s) creada(s) exitosamente.', bookings };
  } catch (error) {
    console.error(`[Handler] Error creando reservas: ${error.message}`);
    throw new Error(`Error creando reservas: ${error.message}`);
  }
};

module.exports = createBookingHandler;
