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

// Rutas para las redirecciones después del pago
router.get("/success", (req, res) => {
  // Aquí puedes manejar la lógica de lo que pasa cuando el pago es exitoso
  res.send("Pago exitoso. Redirigiendo...");
});

router.get("/failure", (req, res) => {
  // Aquí puedes manejar lo que pasa si el pago falla
  res.send("El pago falló. Intenta nuevamente.");
});

router.get("/pending", (req, res) => {
  // Aquí puedes manejar lo que pasa si el pago está pendiente
  res.send("El pago está pendiente.");
});

module.exports = router;
