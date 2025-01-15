const createServiceOrderController = require('../../controllers/serviceOrder/createServiceOrderController');
const createBookingHandler = require('../../handlers/booking/createBookingHandler');

const createServiceOrderHandler = async (req, res) => {
  try {
    console.info(">> Handler: Creando orden de servicio...");
    const orderData = req.body;

    // Llamar al controlador
    const newOrder = await createServiceOrderController(orderData);

    // Verificar estado de pago
    if (orderData.paymentStatus === 'Pagado') {
      const bookingData = {
        id_ServiceOrder: newOrder.dataValues.id_ServiceOrder,
        id_User: newOrder.dataValues.id_User,
        paymentMethod: newOrder.dataValues.paymentMethod,
        paymentInformation: newOrder.dataValues.paymentInformation,
        paymentStatus: newOrder.dataValues.paymentStatus,
      };

      // Llamar al handler de reservas
      const bookingResponse = await createBookingHandler(bookingData);
      console.info(">> Reservas procesadas:", bookingResponse.message);
    }

    res.status(201).json({
      message: 'Orden de servicio creada exitosamente.',
      order: newOrder,
    });
  } catch (error) {
    console.error(">> Error en el handler de creación de orden:", error.message);
    res.status(500).json({ error: `No se pudo crear la orden: ${error.message}` });
  }
};

module.exports = createServiceOrderHandler;
