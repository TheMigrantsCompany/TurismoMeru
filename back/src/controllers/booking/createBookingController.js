const { Booking, Service, sequelize } = require('../../config/db');

const createBookingController = async (id_User, paymentStatus, paymentInformation, id_ServiceOrder, DNI) => {
  console.log('[Controller] paymentInformation recibido:', paymentInformation);
  console.log('[Controller] id_ServiceOrder recibido:', id_ServiceOrder);

  if (!DNI) {
    console.error('[Controller] El campo DNI es obligatorio.');
    throw new Error('El campo DNI es obligatorio.');
  }

  const transaction = await sequelize.transaction();
  try {
    if (!Array.isArray(paymentInformation) || paymentInformation.length === 0) {
      console.error('[Controller] paymentInformation debe ser un arreglo no vacío.');
      throw new Error('paymentInformation debe ser un arreglo no vacío.');
    }

    const bookings = [];
    for (const item of paymentInformation) {
      console.log('[Controller] Datos del item recibido:', item);
      console.log('[Controller] id_ServiceOrder al crear booking:', id_ServiceOrder);

      const { id_Service, lockedStock, totalPeople, totalPrice } = item;
      const validatedTotalPeople = totalPeople || 0;
      const validatedTotalPrice = totalPrice || 0;

      if (validatedTotalPeople <= 0 || validatedTotalPrice <= 0) {
        console.error('[Controller] Valores inválidos en item:', item);
        throw new Error(`Valores inválidos: totalPeople=${validatedTotalPeople}, totalPrice=${validatedTotalPrice}`);
      }

      const service = await Service.findByPk(id_Service, { transaction });
      console.log('[Controller] Servicio obtenido:', service ? service.dataValues : 'No encontrado');

      if (!service) throw new Error(`El servicio con ID ${id_Service} no existe.`);
      if (service.stock < lockedStock) throw new Error(`Stock insuficiente para el servicio ${service.title}.`);

      const lastBooking = await Booking.findOne({
        where: { id_Service },
        order: [['seatNumber', 'DESC']],
        transaction,
      });

      const lastSeatNumber = lastBooking ? lastBooking.seatNumber : 0;

      for (let i = 0; i < lockedStock; i++) {
        const seatNumber = lastSeatNumber + i + 1;
        console.log('[Controller] Creando booking con seatNumber:', seatNumber);

        const booking = await Booking.create({
          id_User,
          id_Service,
          serviceTitle: service.title,
          id_ServiceOrder,
          bookingDate: new Date(),
          paymentStatus,
          DNI,
          seatNumber,
          active: true,
          totalPeople: validatedTotalPeople,
          totalPrice: validatedTotalPrice,
        }, { transaction });

        bookings.push(booking);
      }

      service.stock -= lockedStock;
      await service.save({ transaction });
    }

    await transaction.commit();
    console.log('[Controller] Reservas creadas exitosamente:', bookings);
    return bookings;
  } catch (error) {
    await transaction.rollback();
    console.error('[Controller] Error en createBookingController:', error.message);
    throw new Error(`Error en createBookingController: ${error.message}`);
  }
};

module.exports = createBookingController;
