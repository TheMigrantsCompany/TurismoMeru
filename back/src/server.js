const express = require("express");
const router = require("./routes/index");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const mercadopago = require("mercadopago");

const server = express();

mercadopago.configurations = {
  access_token: process.env.MP_ACCESS_TOKEN,
};

// Middleware para el tamaño de las solicitudes
server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(cookieParser());
server.use(morgan("dev"));

// Middleware CORS global para asegurar que todas las respuestas incluyan las cabeceras necesarias
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Permitir todas las solicitudes
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Middleware CORS con configuración personalizada
server.use(
  cors({
    origin: [
      "http://localhost:5173", // Desarrollo
      "https://www.meruviajes.tur.ar", // Producción
      "https://meruviajes.tur.ar", // Producción sin www
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Habilitar preflight antes de registrar las rutas
server.options("*", cors());

// Agregar una ruta de health check
server.get("/", (req, res) => {
  res.send("Backend is running");
});

// Manejo de rutas
server.use("/", router); // Montar las rutas en la raíz

// Manejo de errores con CORS habilitado en respuestas de error
server.use((err, req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  console.error(err);
  res.status(status).send({ error: message });
});

module.exports = server;
