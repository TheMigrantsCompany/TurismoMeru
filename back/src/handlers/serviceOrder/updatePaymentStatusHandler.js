const updatePaymentStatusController = require('../../controllers/serviceOrder/updatePaymentStatusController');

const updatePaymentStatusHandler = async (req, res) => {
  try {
    const { id_ServiceOrder } = req.params;
    const { paymentStatus, ...rest } = req.body;

    console.log('[Handler] Actualización de estado de pago iniciada.');
    console.log('[Handler] Parámetros recibidos:', { id_ServiceOrder, paymentStatus });
    console.log('[Handler] Body adicional recibido:', rest);

    // Validación de parámetros obligatorios
    if (!id_ServiceOrder || !paymentStatus) {
      return res.status(400).json({ error: 'ID de la orden y estado de pago son requeridos.' });
    }

    // Actualización del estado de pago
    const updatedOrder = await updatePaymentStatusController(id_ServiceOrder, paymentStatus, req.body);
    console.log('[Handler] Orden actualizada exitosamente:', updatedOrder);

    // Respuesta exitosa
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('[Handler] Error en la actualización del estado de pago:', error.stack);
    res.status(400).json({ error: error.message });
  }
};

module.exports = updatePaymentStatusHandler;
