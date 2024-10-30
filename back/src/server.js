const express = require("express");
const router = require("./routes/index");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

const server = express();

// Middleware para el tamaño de las solicitudes
server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(cookieParser());
server.use(morgan("dev"));


// Middleware CORS con configuración personalizada
server.use(cors({
	origin: "http://localhost:5173", // Permite solo este dominio
	credentials: true, // Permite el uso de cookies y autenticación
	methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // Métodos permitidos
 }));
  
// Manejo de rutas
server.use("/", router);

// Manejo de errores
server.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || err;
  console.log(err);
  res.status(status).send(message);
});

module.exports = server;
