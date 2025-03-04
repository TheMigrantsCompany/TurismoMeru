const express = require("express");
const router = require("./routes/index");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
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

// Configuración CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://www.meruviajes.tur.ar",
  "https://meruviajes.tur.ar",
];

server.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Origin"
  );

  // Manejar solicitudes preflight automáticamente
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

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
