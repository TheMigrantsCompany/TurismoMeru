const { MercadoPagoConfig, Preference, Payment } = require("mercadopago");
const dotenv = require("dotenv");
const updatePaymentStatusController = require("../serviceOrder/updatePaymentStatusController");
const axios = require('axios');

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
    console.log('ID de la orden de servicio:', req.body.id_ServiceOrder);
    const preference = {
      external_reference: req.body.id_ServiceOrder,
      items: paymentInformation.map(item => ({
        title: item.title,
        description: item.description || "Sin descripción",
        quantity: item.totalPeople,
        unit_price: item.unit_price,
        currency_id: "ARS",
        date: item.selectedDate || '',
        time: item.selectedTime || '',
      })),
      payer: {
        email,
        identification: {
          type: "DNI",
          number: DNI,
        },
      },
      back_urls: {
      success: `https://www.meruviajes.tur.ar/bookingform?id_ServiceOrder=${req.body.id_ServiceOrder}&id_Service=${paymentInformation[0].id_Service}&title=${encodeURIComponent(paymentInformation[0].title)}&price=${paymentInformation[0].unit_price}&date=${paymentInformation[0].selectedDate || ''}&time=${paymentInformation[0].selectedTime || ''}&totalPeople=${paymentInformation[0].totalPeople || 1}`,
      failure:  "https://www.meruviajes.tur.ar/payment-failure",
      pending: "https://www.meruviajes.tur.ar/payment-pending",
       },
      auto_return: "approved",
      notification_url: "https://www.meruviajes.tur.ar/api/payment/webhook",  // para recibir y reenviar las notificaciones de mervado pago webhookrelay.com
      metadata: {
        id_ServiceOrder: req.body.id_ServiceOrder, 
        id_Service: paymentInformation[0].id_Service,  
        totalPeople: paymentInformation[0].totalPeople,
        DNI: DNI,
        totalPrice: paymentInformation.reduce((total, item) => total + (item.unit_price * item.totalPeople), 0),  
        lockedStock: paymentInformation[0].totalPeople,
        selectedDate: paymentInformation[0].selectedDate || '',
        selectedTime: paymentInformation[0].selectedTime || ''
      },
    };
    

    const paymentPreference = await preferenceAPI.create({ body: preference });

    console.log("Respuesta completa de Mercado Pago:", paymentPreference);

    
    if (!paymentPreference || !paymentPreference.id) {
      throw new Error("No se pudo obtener el ID de la preferencia de pago. Revisa la configuración.");
    }

    return res.status(200).json({ preferenceId: paymentPreference.id });
  } catch (error) {
    console.error("Error al crear la preferencia:", error);
    return res.status(400).json({ error: error.message });
  }
};

exports.processPaymentWebhook = async (req, res) => {
  try {
    console.log("Webhook recibido:", req.body);

    const { type, data } = req.body;

    if (type !== "payment" || !data || !data.id) {
      console.error("Tipo de notificación no soportado o ID no válido.");
      return res.status(400).send("Tipo de notificación inválido.");
    }

    // Obtener la información del pago desde Mercado Pago
    const paymentResponse = await paymentAPI.get({ id: data.id });
    const paymentData = paymentResponse.body || paymentResponse;

    if (!paymentData) {
      console.error("Error: No se obtuvo información del pago.");
      return res.status(500).send("Error al obtener el pago.");
    }

    console.log("Respuesta de MercadoPago:", paymentData);

    // Intentar obtener metadata desde diferentes fuentes
    const metadata = paymentData.metadata || paymentData.additional_info?.payer || {};

    // Extraer los valores de metadata con los nombres correctos
    const serviceOrderId = metadata?.id_service_order || metadata?.id_ServiceOrder;
    const id_Service = metadata?.id_service || metadata?.id_Service;
    const dniValue = metadata?.dni || metadata?.DNI;
    const totalPeople = metadata?.total_people;
    const totalPrice = metadata?.total_price;
    const lockedStock = metadata?.locked_stock;
    const selectedDate = metadata?.selectedDate; 
    const selectedTime = metadata?.selectedTime;

    console.log("Metadata obtenida:", metadata);

    if (!serviceOrderId || !id_Service) {
      console.error("Error: Metadata no encontrada o sin ID de orden o servicio.");
      return res.status(500).send("Error en el pago: Metadata incompleta.");
    }

    if (paymentData.status === "approved") {
      const updateData = {
        id_ServiceOrder: serviceOrderId,
        paymentStatus: "Pagado",
        paymentInformation: [
          {
            id_Service: id_Service,
            totalPeople: totalPeople,
            DNI: dniValue,
            totalPrice: totalPrice,
            lockedStock: lockedStock,
          },
        ],
      };

      console.log("Actualizando orden con datos:", updateData);

      await updatePaymentStatusController(updateData.id_ServiceOrder, updateData.paymentStatus, { paymentInformation: updateData.paymentInformation });
      console.log("Estado de pago actualizado a 'Pagado' en la base de datos.");
      return res.status(200).send("OK");
    } else {
      console.log(`Pago ${paymentData.status} - No se actualiza la orden.`);
      return res.status(200).send("Pago no aprobado.");
    }
  } catch (error) {
    console.error("Error al procesar la notificación:", error);
    return res.status(500).send("Error al procesar la notificación.");
  }
};

