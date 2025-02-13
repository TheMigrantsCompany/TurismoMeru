const { Router } = require("express");
const {
  createPaymentPreference,
  processPaymentWebhook,
} = require("../controllers/payment/paymentController");

const router = Router();

// Ruta para crear la preferencia de pago
router.post("/create-preference", createPaymentPreference);

// Ruta para procesar las notificaciones del webhook
router.post("/webhook", processPaymentWebhook);

router.get("/webhook", (req, res) => {
  res.status(200).send("Webhook endpoint activo.");
});

// Rutas para las redirecciones después del pago
router.get("/success", (req, res) => {
  
  res.send("Pago exitoso. Redirigiendo...");
});

router.get("/failure", (req, res) => {
  
  res.send("El pago falló. Intenta nuevamente.");
});

router.get("/pending", (req, res) => {
  
  res.send("El pago está pendiente.");
});

module.exports = router;
