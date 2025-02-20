// getServiceOrdersByUserController.js
const { ServiceOrder } = require('../../config/db'); // Importamos el modelo ServiceOrder

const getServiceOrdersByUserController = async (id_User) => {
    try {
        const serviceOrders = await ServiceOrder.findAll({
            where: {
                id_User, 
            },
        });

        return serviceOrders; // Devolvemos las órdenes de servicio encontradas
    } catch (error) {
        throw new Error('Error al obtener las órdenes de servicio: ' + error.message);
    }
};

module.exports = getServiceOrdersByUserController; // Exportamos la función