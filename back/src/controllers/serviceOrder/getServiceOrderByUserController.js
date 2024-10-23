// getServiceOrdersByUserController.js
const { ServiceOrder } = require('../../config/db'); // Importamos el modelo ServiceOrder

const getServiceOrdersByUserController = async (id_User) => {
    try {
        // Buscamos las órdenes de servicio donde userId coincide con el id_User proporcionado
        const serviceOrders = await ServiceOrder.findAll({
            where: {
                userId: id_User, // Filtramos por userId
            },
        });

        return serviceOrders; // Devolvemos las órdenes de servicio encontradas
    } catch (error) {
        throw new Error('Error al obtener las órdenes de servicio: ' + error.message);
    }
};

module.exports = getServiceOrdersByUserController; // Exportamos la función
