
const { ServiceOrder } = require('../../config/db');
const  getServiceOrdersByUserController  = require('../../controllers/serviceOrder/getServiceOrderByUserController');
const getServiceOrdersByUserHandler = async (req, res) => {
    const { id_User } = req.params; // Extraemos el id_User de los parámetros de la solicitud
    console.log(id_User);
    try {
        const serviceOrders = await getServiceOrdersByUserController(id_User); // Llamamos al controller
        res.status(200).json(serviceOrders); // Enviamos la respuesta con las órdenes de servicio
    } catch (error) {
        res.status(500).json({ error: error.message }); // Manejo de errores
    }
};

module.exports =  getServiceOrdersByUserHandler ;
