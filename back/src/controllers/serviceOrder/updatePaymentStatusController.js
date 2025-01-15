const { ServiceOrder, Service, sequelize } = require('../../config/db');
const createBookingHandler = require('../../handlers/booking/createBookingHandler');

const updatePaymentStatusController = async (id_ServiceOrder, paymentStatus, body) => {
  const { DNI } = body;
  const transaction = await sequelize.transaction();

  try {
    console.log('[Controller] Inicio de actualización de estado de pago.');
    console.log(`[Controller] Parámetros recibidos: id_ServiceOrder=${id_ServiceOrder}, paymentStatus=${paymentStatus}, body=`, body);

    const serviceOrder = await ServiceOrder.findByPk(id_ServiceOrder, { transaction });
    console.log('[Controller] Orden de servicio obtenida:', serviceOrder ? serviceOrder.dataValues : 'No encontrada');

    if (!serviceOrder) throw new Error(`Orden de servicio no encontrada para id_ServiceOrder=${id_ServiceOrder}`);

    const parsedPaymentInformation = serviceOrder.paymentInformation || [];
    console.log('[Controller] Información de pago parseada:', parsedPaymentInformation);

    if (paymentStatus === 'Pagado') {
      for (const item of parsedPaymentInformation) {
        console.log('[Controller] Procesando item de paymentInformation:', item);

        const service = await Service.findByPk(item.id_Service, { transaction });
        console.log('[Controller] Servicio obtenido:', service ? service.dataValues : 'No encontrado');

        if (!service) throw new Error(`Servicio no encontrado para id_Service=${item.id_Service}`);

        const bookingData = {
          id_User: serviceOrder.id_User,
          DNI: item.DNI || DNI,
          id_Service: item.id_Service,
          totalPeople: item.totalPeople || 0,
          totalPrice: item.totalPrice || 0,
          id_ServiceOrder,
          paymentStatus,
          paymentInformation: parsedPaymentInformation,
        };

        console.log('[Controller] Datos para crear la reserva (booking):', bookingData);

        await createBookingHandler(bookingData);
      }
    }

    serviceOrder.paymentStatus = paymentStatus;
    await serviceOrder.save({ transaction });

    await transaction.commit();
    console.log('[Controller] Estado de pago actualizado correctamente.');

    return { message: 'Estado de pago actualizado correctamente.' };
  } catch (error) {
    await transaction.rollback();
    console.error('[Controller] Error actualizando el estado de pago:', error.message);
    throw new Error(`Error actualizando el estado de pago: ${error.message}`);
  }
};

module.exports = updatePaymentStatusController;