const { ServiceOrder, Service } = require('../../config/db');

// Controlador para crear una nueva orden de servicio
const createServiceOrderController = async (orderData) => {
  const { orderDate, id_User, paymentMethod, items, paymentStatus } = orderData;

  let total = 0;
  const updatedItems = [];

  // Validar y calcular el total con descuentos
  for (const item of items) {
    const excursion = await Service.findByPk(item.id_Service);

    if (!excursion) {
      throw new Error(`La excursión con ID ${item.id_Service} no existe`);
    }

    // Validar descuentos
    const discountForMinors = Math.max(0, Math.min(100, excursion.discountForMinors || 0));
    const discountForSeniors = Math.max(0, Math.min(100, excursion.discountForSeniors || 0));

    // Validar que los valores sean números
    const price = parseFloat(excursion.price || 0);
    const adults = parseInt(item.adults || 0, 10);
    const minors = parseInt(item.minors || 0, 10);
    const seniors = parseInt(item.seniors || 0, 10);

    // Cálculos por tipo de cliente
    const priceForAdults = price * adults;
    const priceForMinors = price * (1 - discountForMinors / 100) * minors;
    const priceForSeniors = price * (1 - discountForSeniors / 100) * seniors;

    const itemTotal = priceForAdults + priceForMinors + priceForSeniors;
    total += itemTotal;

    // Actualizar información del ítem
    updatedItems.push({
      title: excursion.title,
      id_Service: item.id_Service,
      adults,
      minors,
      seniors,
      price: price.toFixed(2), // Mostrar el precio con dos decimales
      itemTotal: itemTotal.toFixed(2) // Mostrar el total con dos decimales
    });
  }

  // Crear la nueva orden en la base de datos
  const newOrder = await ServiceOrder.create({
    orderDate,
    id_User,
    paymentMethod,
    paymentInformation: updatedItems,
    total: total.toFixed(2), // Mostrar el total con dos decimales
    paymentStatus: paymentStatus || 'Pendiente'
  });

  return newOrder; // Devolver los datos al handler
};

module.exports = createServiceOrderController;
