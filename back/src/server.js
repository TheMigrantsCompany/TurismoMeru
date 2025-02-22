const express = require("express");
const router = require("./routes/index");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const { MercadoPagoConfig } = require("mercadopago");

const server = express();

// Configuración de Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

// Middleware para el tamaño de las solicitudes
server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(cookieParser());
server.use(morgan("dev"));

// Middleware CORS con configuración personalizada
server.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://www.meruviajes.tur.ar", "https://meruviajes.tur.ar"]
        : [
            "http://localhost:5173",
            "https://www.meruviajes.tur.ar",
            "https://meruviajes.tur.ar",
          ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

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
