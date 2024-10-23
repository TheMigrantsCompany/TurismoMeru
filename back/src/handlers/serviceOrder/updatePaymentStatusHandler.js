const updatePaymentStatusController = require('../../controllers/serviceOrder/updatePaymentStatusController');

const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;               // ID de la orden desde la URL
    const { paymentStatus } = req.body;      // Estado de pago desde el cuerpo de la solicitud

    // Llamar al controlador para actualizar el estado de pago
    const updatedOrder = await updatePaymentStatusController(id, paymentStatus);

    res.status(200).json(updatedOrder);  // Devolver la orden actualizada en la respuesta
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = updatePaymentStatus;
