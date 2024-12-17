const { ServiceOrder, Booking } = require('../../config/db');
const createBookingHandler = require('../../handlers/booking/createBookingHandler');

const updatePaymentStatusController = async (orderId, paymentStatus) => {
  try {
    // Encontrar la orden de servicio por ID
    const order = await ServiceOrder.findByPk(orderId);
    if (!order) throw new Error('Service order not found');
    
    // Extraer los valores de order.dataValues
    const { id_ServiceOrder, id_User, paymentMethod, paymentInformation } = order.dataValues;

    // Actualizar el estado de pago solo si no está ya pagado
    if (paymentStatus === 'Pagado' && order.paymentStatus !== 'Pagado') {
      await order.update({ paymentStatus: 'Pagado' });

      // Verificar el estado de pago y procesar reservas si es 'Pagado'
      const bookingData = {
        id_ServiceOrder: id_ServiceOrder,    // ID de la orden de servicio
        id_User,                      // ID del usuario
        paymentMethod: paymentMethod,        // Método de pago de la orden
        paymentInformation: paymentInformation, // Información de pago
        paymentStatus: 'Pagado',             // Estado de pago (Pagado)
      };

      /// Llamar al handler que crea las reservas y manejar la respuesta
      const bookingResponse = await createBookingHandler(bookingData);
      console.log(bookingResponse.message); // O cualquier otra acción que desees
    }

    return order;  // Devolver la orden actualizada
  } catch (error) {
    throw new Error('Error updating payment status');
  }
};

module.exports = updatePaymentStatusController;
