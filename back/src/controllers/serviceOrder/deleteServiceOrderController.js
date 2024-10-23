const { ServiceOrder } = require('../../config/db');

const deleteServiceOrderController = async (id_ServiceOrder) => {
  try {
    // Verificar si la orden existe
    const serviceOrder = await ServiceOrder.findByPk(id_ServiceOrder);
    
    if (!serviceOrder) {
      throw new Error('La orden de servicio no existe');
    }

    // Eliminar la orden
    await serviceOrder.destroy();

    return { message: 'Orden de servicio eliminada exitosamente' };
  } catch (error) {
    throw new Error(`Error al eliminar la orden de servicio: ${error.message}`);
  }
};

module.exports = { deleteServiceOrderController };
