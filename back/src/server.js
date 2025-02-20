const express = require("express");
const router = require("./routes/index");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const mercadopago = require("mercadopago"); 

const server = express();


mercadopago.configurations = {
  access_token: process.env.MP_ACCESS_TOKEN
};

// Middleware para el tamaño de las solicitudes
server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(cookieParser());
server.use(morgan("dev"));

// Middleware CORS con configuración personalizada
server.use('*',cors({
  origin: [
    "http://localhost:5173",
    "https://bearing-settled-consult-je.trycloudflare.com", // tunel para back cloudflared tunnel --url http://localhost:3001
    "https://self-brad-cz-previously.trycloudflare.com"     //  tunel para front cloudflared tunnel --url http://localhost:5173
  ],
  credentials: true, // Permite cookies y autenticación
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
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
