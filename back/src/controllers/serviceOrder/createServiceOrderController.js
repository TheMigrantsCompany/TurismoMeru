const { ServiceOrder, Service, User, sequelize } = require("../../config/db");

const createServiceOrderController = async (orderData) => {
  const { orderDate, id_User, paymentMethod, items, paymentStatus } = orderData;

  console.log("Datos recibidos para crear la orden:", JSON.stringify(orderData, null, 2));

  let total = 0;
  const updatedItems = [];

  const transaction = await sequelize.transaction();

  try {
    // Buscar el usuario e incluir el DNI explícitamente
    console.log("Buscando usuario con ID:", id_User);
    const user = await User.findByPk(id_User, {
      attributes: ["DNI"],
      transaction,
    });

    if (!user) {
      throw new Error(`El usuario con ID ${id_User} no existe`);
    }

    const { DNI } = user;
    console.log("DNI del usuario:", DNI);

    if (!DNI) {
      throw new Error(`El usuario con ID ${id_User} no tiene un DNI registrado`);
    }

    for (const item of items) {
      console.log("Procesando item:", JSON.stringify(item, null, 2));
      const excursion = await Service.findByPk(item.id_Service, {
        transaction,
      });

      if (!excursion) {
        throw new Error(`La excursión con ID ${item.id_Service} no existe`);
      }

      console.log("Excursión encontrada:", excursion.title);

      const discountForMinors = Math.max(0, Math.min(100, excursion.discountForMinors || 0));
      const discountForSeniors = Math.max(0, Math.min(100, excursion.discountForSeniors || 0));

      const price = parseFloat(excursion.price || 0);
      const adults = parseInt(item.adults || 0, 10);
      const minors = parseInt(item.minors || 0, 10);
      const seniors = parseInt(item.seniors || 0, 10);

      const totalReservations = adults + minors + seniors;
      console.log("Reservas totales para el item:", totalReservations);

      // Validar stock disponible
      const newLockedStock = excursion.lockedStock + totalReservations;
      if (newLockedStock > excursion.stock) {
        throw new Error(`No hay suficiente stock para el servicio: ${excursion.title}`);
      }

      console.log("Actualizando lockedStock a:", newLockedStock);
      await excursion.update({ lockedStock: newLockedStock }, { transaction });

      const priceForAdults = price * adults;
      const priceForMinors = price * (1 - discountForMinors / 100) * minors;
      const priceForSeniors = price * (1 - discountForSeniors / 100) * seniors;

      const itemTotal = priceForAdults + priceForMinors + priceForSeniors;
      total += itemTotal;

      updatedItems.push({
        title: excursion.title,
        id_Service: item.id_Service,
        adults,
        minors,
        seniors,
        price: parseFloat(price.toFixed(2)), // Mantén como número
        //itemTotal: parseFloat(itemTotal.toFixed(2)), // Mantén como número
        lockedStock: newLockedStock,
        DNI,
        totalPrice: parseFloat(itemTotal.toFixed(2)), // Agregar totalPrice
        totalPeople: totalReservations, // Agregar totalPeople
      });
    }

    console.log("Creando orden de servicio con items actualizados:", JSON.stringify(updatedItems, null, 2));
    const newOrder = await ServiceOrder.create(
      {
        orderDate,
        id_User,
        paymentMethod,
        paymentInformation: updatedItems,
        total: total.toFixed(2),
        paymentStatus: paymentStatus || "Pendiente",
      },
      { transaction }
    );

    const serviceIds = items.map((item) => item.id_Service);
    await newOrder.addServices(serviceIds, { transaction });

    await transaction.commit();
    console.log("Orden creada exitosamente:", JSON.stringify(newOrder, null, 2));
    return newOrder;
  } catch (error) {
    console.error("Error al crear la orden de servicio:", error.message);
    await transaction.rollback();
    throw new Error(`Error al crear la orden de servicio: ${error.message}`);
  }
};

module.exports = createServiceOrderController;
