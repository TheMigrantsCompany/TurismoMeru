const express = require("express");
const router = require("./routes/index");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

const server = express();

// Middleware CORS con configuración personalizada
server.use(cors({
  origin: "http://localhost:3001", // permite solo este dominio
  credentials: true, // permite el uso de cookies y autenticación
}));

server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(cookieParser());
server.use(morgan("dev"));

// Configuración de rutas
server.use("/", router);

// Manejo de errores
server.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || err;
  console.log(err);
  res.status(status).send(message);
});

module.exports = server;
