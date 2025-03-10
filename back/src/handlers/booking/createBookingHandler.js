const createBookingController = require('../../controllers/booking/createBookingController');

cconst createBookingHandler = async (data, transaction = null)  => {
  const bookingData = data.body ? data.body : data; // Extraer el body del request
  console.log("[Handler] Datos recibidos en createBookingHandler:", bookingData);
  console.log("paymentInformation recibido:", bookingData.paymentInformation);
  
  try {
    const bookings = await createBookingController(
      bookingData.id_User,
      bookingData.paymentStatus,
      bookingData.paymentInformation,
      bookingData.id_ServiceOrder,
      bookingData.DNI,
      transaction
    );
    console.log("[Handler] Reservas creadas exitosamente:", bookings);
    return { message: 'Reserva(s) creada(s) exitosamente.', bookings };
  } catch (error) {
    console.error(`[Handler] Error creando reservas: ${error.message}`);
    throw new Error(`Error creando reservas: ${error.message}`);
  }
};

module.exports = createBookingHandler;
