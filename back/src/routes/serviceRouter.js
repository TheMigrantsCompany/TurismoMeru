const express = require('express');

// Importación de handlers
const createServiceHandler = require('../handlers/service/createServiceHandler');
const getAllServicesHandler = require('../handlers/service/getAllServicesHandler');
const getServiceByIdHandler = require('../handlers/service/getServiceByIdHandler');
const getServiceByNameHandler = require('../handlers/service/getServiceByNameHandler');
const updateServiceHandler = require('../handlers/service/updateServiceHandler');
const toggleServiceStateHandler = require('../handlers/service/toggleServiceStateHandler');
const deleteServiceByIdHandler = require('../handlers/service/deleteServiceByIdHandler');
const deleteServiceByNameHandler = require('../handlers/service/deleteServiceByNameHandler');

// Definición de enrutador
const serviceRouter = express.Router();

// Rutas

// Crear un nuevo servicio
serviceRouter.post('/', createServiceHandler);

// Obtener todos los servicios
serviceRouter.get('/', getAllServicesHandler);

// Obtener un servicio por ID
serviceRouter.get('/id/:id', getServiceByIdHandler);

// Obtener servicios por nombre
serviceRouter.get('/name/:name', getServiceByNameHandler);

// Actualizar un servicio por ID
serviceRouter.put('/id/:id', updateServiceHandler);

// Cambiar el estado activo/inactivo de un servicio
serviceRouter.patch('/:id/toggle', toggleServiceStateHandler);

// Eliminar un servicio por ID
serviceRouter.delete('/id/:id', deleteServiceByIdHandler);

// Eliminar servicios por nombre
serviceRouter.delete('/name/:name', deleteServiceByNameHandler);

module.exports = serviceRouter;
