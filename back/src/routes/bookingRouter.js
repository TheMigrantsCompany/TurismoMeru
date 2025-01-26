const express = require('express');

// Handlers 
const createBookingHandler = require('../handlers/booking/createBookingHandler');
const getAllBookingsHandler = require('../handlers/booking/getAllBookingsHandler'); //
const getBookingByIdHandler = require('../handlers/booking/getBookingByIdHandler'); //
const getBookingsByServiceTitleHandler = require('../handlers/booking/getBookingsByServiceTitleHandler'); //
const getBookingsByUserIdHandler = require('../handlers/booking/getBookingsByUserIdHandler'); //
const updateBookingHandler = require('../handlers/booking/updateBookingHandler'); //
const deleteBookingHandler = require('../handlers/booking/deleteBookingHandler'); //
const getBookingsByServiceHandler = require('../handlers/booking/getBookingsByServiceHandler');
const getBookingsByPassengerNameHandler = require('../handlers/booking/getBookingsByPassengerNameHandler');

// Definicion de enrutador
const bookingRouter = express.Router();

// Rutas

//Rutas para crear una reserva nueva
bookingRouter.post('/', createBookingHandler);

//Rutas para obtener todas las reservas
bookingRouter.get('/', getAllBookingsHandler);
// Ruta para obtener la reserva por id 
bookingRouter.get('/id/:id_Booking', getBookingByIdHandler);
//Ruta para obtener todas las reservas de un servicio
bookingRouter.get('/service/:id_Service', getBookingsByServiceHandler);
//Rutas para obtener todas las reservas que tengan el titulo de la excursion
bookingRouter.get('/serviceName/:serviceTitle', getBookingsByServiceTitleHandler);
//Ruta para obtener todas las reservas de un usuario
bookingRouter.get('/user/:id_User', getBookingsByUserIdHandler);

//Ruta para actualizar los datos de la reserva por id 
bookingRouter.patch('/id/:id_Booking', updateBookingHandler);

//Ruta para eliminar una reserva por id
bookingRouter.delete('/id/:id_Booking', deleteBookingHandler);

//Ruta para obtener las reservas por nombre de pasajero
bookingRouter.get('/passenger-name/:passengerName', getBookingsByPassengerNameHandler);


module.exports = bookingRouter;