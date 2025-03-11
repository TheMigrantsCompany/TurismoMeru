const deleteServiceOrderController = require("../../controllers/serviceOrder/deleteServiceOrderController");

const deleteServiceOrderHandler = async (req, res) => {
  try {
    const { id_ServiceOrder } = req.params;
    console.log("[Handler] Iniciando eliminación de orden:", id_ServiceOrder);

    if (!id_ServiceOrder) {
      return res.status(400).json({
        error: "Se requiere el ID de la orden",
      });
    }

    const result = await deleteServiceOrderController(id_ServiceOrder);
    console.log("[Handler] Orden eliminada exitosamente:", id_ServiceOrder);

    res.status(200).json(result);
  } catch (error) {
    console.error("[Handler] Error al eliminar orden:", error.message);

    // Determinar el código de estado según el tipo de error
    const statusCode = error.message.includes("no encontrada") ? 404 : 400;

    res.status(statusCode).json({
      error: error.message,
    });
  }
};

module.exports = deleteServiceOrderHandler;
