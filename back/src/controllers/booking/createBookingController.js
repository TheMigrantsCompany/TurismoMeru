const { Booking, Service, sequelize } = require('../../config/db');

const createBookingController = async (id_User, paymentStatus, paymentInformation, id_ServiceOrder, DNI) => {
  //console.log('[Controller] paymentInformation recibido:', paymentInformation);
 // console.log('[Controller] id_ServiceOrder recibido:', id_ServiceOrder);

  if (!DNI) {
    console.error('[Controller] El campo DNI es obligatorio.');
    throw new Error('El campo DNI es obligatorio.');
  }

  if (!Array.isArray(paymentInformation) || paymentInformation.length === 0) {
    console.error('[Controller] paymentInformation debe ser un arreglo no vacío.');
    throw new Error('paymentInformation debe ser un arreglo no vacío.');
  }

  const transaction = await sequelize.transaction({ autocommit: false });
  try {
    const bookings = [];

    for (const item of paymentInformation) {
      //console.log('[Controller] Datos del item recibido:', item);

      const { id_Service, lockedStock, totalPeople, totalPrice, date, time } = item;

      const validatedTotalPeople = totalPeople || 0;
      const validatedTotalPrice = totalPrice || 0;

      if (validatedTotalPeople <= 0 || validatedTotalPrice <= 0) {
        console.error('[Controller] Valores inválidos en item:', item);
        throw new Error(
          `Valores inválidos: totalPeople=${validatedTotalPeople}, totalPrice=${validatedTotalPrice}`
        );
      }

      // Buscar el servicio por ID con bloqueo para evitar conflictos en transacciones concurrentes
      //console.log('[Controller] Buscando servicio con ID:', id_Service);
      const service = await Service.findByPk(id_Service, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      if (!service) {
        throw new Error(`El servicio con ID ${id_Service} no existe.`);
      }

      //console.log('[Controller] Servicio encontrado:', service);

      // Validar formato de availabilityDate
      if (
        !Array.isArray(service.availabilityDate) ||
        !service.availabilityDate.every(
          (slot) =>
            typeof slot.date === 'string' &&
            typeof slot.time === 'string' &&
            typeof slot.stock === 'number'
        )
      ) {
        console.error('[Controller] Formato inválido en availabilityDate del servicio:', service.availabilityDate);
        throw new Error(`El campo availabilityDate en el servicio ${service.title} tiene un formato inválido.`);
      }

      if (service.stock < lockedStock) {
        console.error('[Controller] Stock global insuficiente:', {
          stockGlobal: service.stock,
          lockedStock,
        });
        throw new Error(`Stock global insuficiente para el servicio ${service.title}.`);
      }

      // Buscar el slot específico en availabilityDate
      const formattedDate = new Date(date).toISOString().split('T')[0];
      const formattedTime = time.trim();
      const availabilityItem = service.availabilityDate.find(
        (slot) => slot.date === formattedDate && slot.time === formattedTime
      );

      if (!availabilityItem) {
        console.error('[Controller] No se encontró disponibilidad para la fecha y hora especificadas:', {
          date: formattedDate,
          time: formattedTime,
        });
        throw new Error(
          `No se encontró disponibilidad para la fecha ${formattedDate} a las ${formattedTime} en el servicio ${service.title}.`
        );
      }

      if (availabilityItem.stock < lockedStock) {
        console.error('[Controller] Stock insuficiente para el slot especificado:', {
          slotStock: availabilityItem.stock,
          lockedStock,
        });
        throw new Error(
          `Stock insuficiente para la fecha ${formattedDate} a las ${formattedTime} en el servicio ${service.title}.`
        );
      }

      /*console.log('[Controller] Reducción de stock. Antes:', {
        globalStock: service.stock,
        slotStock: availabilityItem.stock,
      });*/

      // Actualizar el arreglo de availabilityDate con el nuevo stock
      const updatedAvailabilityDate = service.availabilityDate.map((slot) =>
        slot.date === formattedDate && slot.time === formattedTime
          ? { ...slot, stock: slot.stock - lockedStock }
          : slot
      );

      // Reducir el stock global del servicio
      service.stock -= lockedStock;

      /*console.log('[Controller] Reducción de stock. Después:', {
        globalStock: service.stock,
        updatedAvailabilityDate,
      });*/

      // Guardar los cambios en la base de datos
      await service.update(
        {
          availabilityDate: updatedAvailabilityDate,
          stock: service.stock,
          lockedStock: 0, // Aquí se libera el lockedStock
        },
        { transaction }
      );

      //console.log('[Controller] Stock actualizado en la base de datos.');

      // Obtener último número de asiento
      const lastBooking = await Booking.findOne({
        where: { id_Service },
        order: [['seatNumber', 'DESC']],
        transaction,
      });
      const lastSeatNumber = lastBooking ? lastBooking.seatNumber : 0;

      //console.log('[Controller] Último número de asiento:', lastSeatNumber);

      // Crear nuevas reservas
      const newBookings = Array.from({ length: lockedStock }, (_, i) => ({
        id_User,
        id_Service,
        serviceTitle: service.title,
        id_ServiceOrder,
        bookingDate: new Date(),
        paymentStatus,
        DNI,
        seatNumber: lastSeatNumber + i + 1,
        active: true,
        totalPeople: validatedTotalPeople,
        totalPrice: validatedTotalPrice,
        dateTime: `${formattedDate} ${formattedTime}`,
        passengerName: item.passengerName || 'Desconocido', 
      }));

      const createdBookings = await Booking.bulkCreate(newBookings, { transaction });
      bookings.push(...createdBookings);
    }

    await transaction.commit();
    //console.log('[Controller] Reservas creadas exitosamente:', bookings);
    return bookings;
  } catch (error) {
    await transaction.rollback();
    console.error('[Controller] Error en createBookingController:', error.message);
    throw new Error(`Error en createBookingController: ${error.message}`);
  }
};

module.exports = createBookingController;
