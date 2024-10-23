const { deleteServiceOrderController } = require('../../controllers/serviceOrder/deleteServiceOrderController');

const deleteServiceOrderHandler = async (req, res) => {
  const { id_ServiceOrder } = req.params; // Obtener el ID de la orden desde los parámetros de la URL
    console.log(id_ServiceOrder)
  try {
    const result = await deleteServiceOrderController(id_ServiceOrder);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = deleteServiceOrderHandler;
