const createBookingController = require('../../controllers/booking/createBookingController');

const createBookingHandler = async (bookingData) => {
  const { id_User, paymentStatus, paymentInformation, id_ServiceOrder, DNI } = bookingData;

  console.log("[Handler] Datos recibidos en createBookingHandler:", bookingData);

  if (!Array.isArray(paymentInformation) || paymentInformation.length === 0) {
    console.error("[Handler] paymentInformation no es un arreglo válido o está vacío.");
    throw new Error('paymentInformation no es un arreglo válido o está vacío.');
  }

  if (!DNI) {
    console.error("[Handler] El campo DNI es obligatorio y no puede estar vacío.");
    throw new Error('El campo DNI es obligatorio y no puede estar vacío.');
  }

  console.log("[Handler] Calculando totalPeople...");
  const totalPeople = paymentInformation.reduce(
    (sum, item) => {
      const people = (item.adults || 0) + (item.minors || 0) + (item.seniors || 0);
      console.log(`[Handler] Suma parcial de totalPeople: ${sum} + ${people} (adults=${item.adults}, minors=${item.minors}, seniors=${item.seniors})`);
      return sum + people;
    },
    0
  );
  console.log("[Handler] totalPeople calculado:", totalPeople);

  console.log("[Handler] Calculando totalPrice...");
  const totalPrice = paymentInformation[0]?.totalPrice || 0;
  console.log("[Handler] totalPrice obtenido:", totalPrice);

  if (!totalPeople || !totalPrice) {
    console.error(`[Handler] Valores inválidos: totalPeople=${totalPeople}, totalPrice=${totalPrice}`);
    throw new Error(
      `Valores inválidos en createBookingController: totalPeople=${totalPeople}, totalPrice=${totalPrice}`
    );
  }

  try {
    console.log("[Handler] Llamando a createBookingController con los datos:", {
      id_User,
      paymentStatus,
      paymentInformation,
      id_ServiceOrder,
      DNI,
    });

    const bookings = await createBookingController(id_User, paymentStatus, paymentInformation, id_ServiceOrder, DNI);

    console.log("[Handler] Reservas creadas exitosamente:", bookings);

    return { message: 'Reserva(s) creada(s) exitosamente.', bookings };
  } catch (error) {
    console.error(`[Handler] Error creando reservas: ${error.message}`);
    throw new Error(`Error creando reservas: ${error.message}`);
  }
};

module.exports = createBookingHandler;
