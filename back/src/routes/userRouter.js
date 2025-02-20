const express = require("express");

// Handlers
const postUserHandler = require("../handlers/user/postUserHandler");
const getAllUsersHandler = require("../handlers/user/getAllUsersHandler");
const getUserByIdHandler = require("../handlers/user/getUserByIdHandler");
const getUserByNameHandler = require("../handlers/user/getUserByNameHandler");
const getUserByDniHandler = require("../handlers/user/getUserByDniHandler");
const putUserHandler = require("../handlers/user/putUserHandler");
const toggleUserActiveHandler = require("../handlers/user/toggleUserActiveHandler");
const deleteUserByIdHandler = require("../handlers/user/deleteUserByIdHandler");
const deleteUserByNameHandler = require("../handlers/user/deleteUserByNameHandler");
const syncUsersHandler = require("../handlers/user/syncUsersHandler");
const getUserByEmailHandler = require("../handlers/user/getUserByEmailHandler");

// Middlewares
const verifyToken = require("../middlewares/verifyToken");
const checkAdminRole = require("../middlewares/checkAdminRole");

// Definición de enrutador
const userRouter = express.Router();

// Rutas

// Crear un nuevo usuario
userRouter.post("/", postUserHandler);

// Obtener todos los usuarios
userRouter.get("/", verifyToken, checkAdminRole, getAllUsersHandler);

// Obtener un usuario por su ID
userRouter.get("/id/:id", verifyToken, getUserByIdHandler);

// Obtener usuarios por nombre
userRouter.get("/name/:name", verifyToken, getUserByNameHandler);

// Obtener usuarios por DNI
userRouter.get("/DNI/:dni", verifyToken, getUserByDniHandler);

// Actualizar un usuario por su ID (PUT)
userRouter.put("/id/:id", verifyToken, putUserHandler);

// Activar/desactivar un usuario por su ID (PATCH)
userRouter.patch(
  "/:id/active",
  verifyToken,
  checkAdminRole,
  toggleUserActiveHandler
);

// Eliminar un usuario por su ID
userRouter.delete(
  "/id/:id",
  verifyToken,
  checkAdminRole,
  deleteUserByIdHandler
);

// Eliminar un usuario por nombre
userRouter.delete(
  "/name/:name",
  verifyToken,
  checkAdminRole,
  deleteUserByNameHandler
);

// Obtener un usuario por su correo
userRouter.get("/email/:email", verifyToken, getUserByEmailHandler);

/*
// Sincronizar usuarios con Firebase
userRouter.get('/sync', syncUsersHandler);
*/
// Exportar el enrutador
module.exports = userRouter;
