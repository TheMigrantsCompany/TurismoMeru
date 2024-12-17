const express = require('express');

const createReviewHandler  = require('../handlers/review/createReviewHandler');
const getAllReviewsHandler = require('../handlers/review/getAllReviewsHandler');
const getReviewByIdHandler = require('../handlers/review/getReviewByIdHandler');
const getReviewsByServiceTitleHandler = require('../handlers/review/getReviewsByServiceTitleHandler');
const getReviewsByUserIdHandler = require('../handlers/review/getReviewsByUserIdHandler');
const patchReviewActiveHandler = require('../handlers/review/patchReviewActiveHandler');
const updateReviewHandler = require('../handlers/review/updateReviewHandler');
const deleteReviewHandler = require('../handlers/review/deleteReviewHandler');

// CRUD para las reseñas


const reviewRouter = express.Router();


//Ruta para crear una reseña
reviewRouter.post('/', createReviewHandler);
//Ruta para obtener todas las reseñas
reviewRouter.get('/', getAllReviewsHandler);
// Ruta para obtener las reseñas por id 
reviewRouter.get('/id/:id', getReviewByIdHandler);
// Ruta para obtener las reseñas por título de excursión  
reviewRouter.get('/service/:title', getReviewsByServiceTitleHandler);
// Ruta para obtener las reseñas por usuario  id  (user_id)
reviewRouter.get('/user/:id_User', getReviewsByUserIdHandler);
// Ruta para aprobar las reseñas
reviewRouter.patch('/id/:id/approve', patchReviewActiveHandler);
// Ruta para modificar las reseñas
reviewRouter.patch('/id/:id', updateReviewHandler);
// Ruta para eliminar una reseña por id
reviewRouter.delete('/id/:id', deleteReviewHandler);


module.exports = reviewRouter;
