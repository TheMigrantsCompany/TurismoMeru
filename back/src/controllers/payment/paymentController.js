const { MercadoPagoConfig, Preference, Payment } = require("mercadopago");
const dotenv = require("dotenv");
const updatePaymentStatusController = require("../serviceOrder/updatePaymentStatusController");

dotenv.config();

// Configuración de Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
  options: { timeout: 5000 },
});

const preferenceAPI = new Preference(client);
const paymentAPI = new Payment(client);

// Validaciones
const validatePaymentInformation = (paymentInformation) => {
  if (!Array.isArray(paymentInformation) || paymentInformation.length === 0) {
    throw new Error("El campo 'paymentInformation' debe contener al menos un ítem válido.");
  }

  paymentInformation.forEach((item, index) => {
    if (!item.title || typeof item.title !== "string") {
      throw new Error(`El campo 'title' en el ítem ${index + 1} es obligatorio y debe ser una cadena válida.`);
    }

    if (isNaN(parseFloat(item.unit_price)) || parseFloat(item.unit_price) <= 0) {
      throw new Error(`El campo 'unit_price' en el ítem ${index + 1} debe ser un número válido mayor que 0.`);
    }

    if (isNaN(parseInt(item.totalPeople, 10)) || parseInt(item.totalPeople, 10) <= 0) {
      throw new Error(`El campo 'totalPeople' en el ítem ${index + 1} debe ser un número válido mayor que 0.`);
    }
  });
};

const validateRequestBody = ({ paymentInformation, id_User, DNI, email }) => {
  if (!id_User || typeof id_User !== "string") {
    throw new Error("El campo 'id_User' es obligatorio y debe ser una cadena válida.");
  }

  if (DNI && (typeof DNI !== "string" || DNI.trim() === "")) {
    throw new Error("El campo 'DNI' debe ser una cadena válida si se proporciona.");
  }

  // Verifica que el campo email esté presente y sea válido
  if (!email || typeof email !== "string" || !email.match(/^[^@]+@[^@]+\.[^@]+$/)) {
    throw new Error("El campo 'email' es obligatorio y debe ser un correo electrónico válido.");
  }

  validatePaymentInformation(paymentInformation);
};

// Crear la preferencia de pago
exports.createPaymentPreference = async (req, res) => {
  try {
    const { paymentInformation, id_User, DNI, email } = req.body;

    validateRequestBody({ paymentInformation, id_User, DNI, email });

    const preference = {
      items: paymentInformation.map(item => ({
        title: item.title,
        description: item.description || "Sin descripción",
        quantity: item.totalPeople,
        unit_price: item.unit_price,
        currency_id: "ARS",
      })),
      payer: {
        email,
        identification: {
          type: "DNI",
          number: DNI,
        },
      },
      back_urls: {
        success: "http://localhost:5173/success",
        failure: "http://localhost:5173/failure",
        pending: "http://localhost:5173/pending",
      },
      auto_return: "approved",
    };

    const paymentPreference = await preferenceAPI.create({ body: preference });

    console.log("Respuesta completa de Mercado Pago:", paymentPreference);

    // Validación corregida
    if (!paymentPreference || !paymentPreference.id) {
      throw new Error("No se pudo obtener el ID de la preferencia de pago. Revisa la configuración.");
    }

    return res.status(200).json({ preferenceId: paymentPreference.id });
  } catch (error) {
    console.error("Error al crear la preferencia:", error);
    return res.status(400).json({ error: error.message });
  }
};

// Procesar las notificaciones del webhook
exports.processPaymentWebhook = async (req, res) => {
  try {
    const { type, data } = req.body;
    const payment = await paymentAPI.findById(data.id);
    
    console.log("Notificación recibida:", req.body); // Log para depuración

    if (type === "payment") {
      const payment = await paymentAPI.findById(data.id);

      if (payment.body) {
        const id_ServiceOrder = payment.body.metadata.id_ServiceOrder;
        const paymentStatus = payment.body.status === "approved" ? "Pagado" : "Pendiente";
        const paymentMethod = payment.body.payment_method_id;  // Aquí obtenemos el método de pago
      
        await updatePaymentStatusController(id_ServiceOrder, paymentStatus, {
          DNI: payment.body.metadata.DNI || null,
          paymentMethod,  // Pasamos el método de pago
        });
      }
    }

    res.status(200).send("OK");
  } catch (error) {
    console.error("Error al procesar el webhook:", error.message); // Log del error
    res.status(500).send("Error al procesar la notificación del pago.");
  }
};
