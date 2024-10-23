const createServiceOrderController = require('../../controllers/serviceOrder/createServiceOrderController');
const createBookingHandler = require('../../handlers/booking/createBookingHandler');

// Handler para la creación de la orden de servicio
const createServiceOrderHandler = async (req, res) => {
  try {
    const orderData = req.body;

    // Llamar al controlador para crear la orden de servicio
    const newOrder = await createServiceOrderController(orderData);

    // Verificar el estado de pago y procesar reservas si es 'Pagado'
    if (orderData.paymentStatus === 'Pagado') {
      const bookingData = {
        id_ServiceOrder: newOrder.dataValues.id_ServiceOrder,
        userId: newOrder.dataValues.userId,
        paymentMethod: newOrder.dataValues.paymentMethod,
        paymentInformation: newOrder.dataValues.paymentInformation,
        paymentStatus: newOrder.dataValues.paymentStatus,
      };

      // Llamar al handler que crea las reservas y manejar la respuesta
      const bookingResponse = await createBookingHandler(bookingData);
      console.log(bookingResponse.message); // O cualquier otra acción que desees
    }

    res.status(201).json({
      message: 'Orden de servicio creada exitosamente.',
      order: newOrder
    });
  } catch (error) {
    console.error('Error en el handler de creación de orden:', error.stack);
    res.status(500).json({ error: 'No se pudo crear la orden de servicio.' });
  }
};

module.exports = createServiceOrderHandler;
