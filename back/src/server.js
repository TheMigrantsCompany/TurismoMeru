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

// Eliminar el middleware CORS global y dejar solo una configuración CORS
server.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://www.meruviajes.tur.ar",
      "https://meruviajes.tur.ar",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Origin"],
    exposedHeaders: ["Access-Control-Allow-Origin"],
  })
);

// Habilitar preflight
server.options("*", cors());

// Health check route
server.get("/", (req, res) => {
  res.send("Backend is running");
});

// Rutas
server.use("/", router);

// Manejo de errores
server.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  console.error("Error detallado:", {
    mensaje: err.message,
    stack: err.stack,
    status: status,
  });
  res.status(status).json({
    error: true,
    message: message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

module.exports = server;
