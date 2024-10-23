const { ServiceOrder, Service } = require('../../config/db');

// Controlador para crear una nueva orden de servicio
const createServiceOrderController = async (orderData) => {
  const { orderDate, id_User, paymentMethod, items, paymentStatus } = orderData;

  let total = 0;
  const updatedItems = [];

  // Validar que todas las excursiones existan y calcular el total
  for (const item of items) {
    const excursion = await Service.findByPk(item.ServiceId);

    if (!excursion) {
      throw new Error(`La excursión con ID ${item.ServiceId} no existe`);
    }

    // Calcular el precio total de este item (precio de la excursión * cantidad)
    const itemTotal = excursion.price * item.quantity;
    total += itemTotal;

    // Actualizar la información del ítem para que incluya el precio real
    updatedItems.push({
      title: excursion.title,
      ServiceId: item.ServiceId,
      quantity: item.quantity,
      price: excursion.price
    });
  }

  // Crear la nueva orden en la base de datos
  const newOrder = await ServiceOrder.create({
    orderDate,
    userId: id_User,
    paymentMethod,
    paymentInformation: updatedItems,
    total,
    paymentStatus: paymentStatus || 'Pendiente'
  });

  return newOrder; // Devolver los datos al handler
};

module.exports =  createServiceOrderController ;
