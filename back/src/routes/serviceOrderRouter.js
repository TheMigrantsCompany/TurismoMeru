const express = require('express');

// Handlers 
const createServiceOrderHandler = require('../handlers/serviceOrder/createServiceOrderHandler');
const getAllServicesOrderHandler = require('../handlers/serviceOrder/getServiceOrdersHandler');
const getServiceOrderById = require('../handlers/serviceOrder/getServiceOrderByIdHandler');
const getServiceOrdersByUserHandler = require('../handlers/serviceOrder/getServiceOrdersByUserHandler');
const searchServiceOrderHandler = require('../handlers/serviceOrder/searchServiceOrdersHandler');
const updatePaymentStatusHandler = require('../handlers/serviceOrder/updatePaymentStatusHandler');
const deleteServiceOrderHandler = require('../handlers/serviceOrder/deleteServiceOrderHandler');

// Definicion de enrutador
const serviceOrderRouter = express.Router();

// Rutas
// Ruta para crear una Orden nueva
serviceOrderRouter.post('/', createServiceOrderHandler);

// Ruta para obtener todas las Órdenes
serviceOrderRouter.get('/', getAllServicesOrderHandler);

// Ruta para obtener una Orden por ID
serviceOrderRouter.get('/id/:id', getServiceOrderById);

// Ruta para obtener las ordenes de un usuario
serviceOrderRouter.get('/user/:id_User', getServiceOrdersByUserHandler);

// Ruta para buscar Órdenes por nombre de excursión
serviceOrderRouter.get('/search/:title', searchServiceOrderHandler);

// Ruta para actualizar el estado de pago de una Orden y generar una reserva
serviceOrderRouter.patch('/id/:id_ServiceOrder', updatePaymentStatusHandler);

// Ruta para eliminar una orden de servicio
serviceOrderRouter.delete('/id/:id_ServiceOrder', deleteServiceOrderHandler);

// Este es el enrutador para las órdenes de servicios.
module.exports = serviceOrderRouter;
