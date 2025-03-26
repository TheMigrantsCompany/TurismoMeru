const { ServiceOrder, Service, User, sequelize } = require("../../config/db");

const createServiceOrderController = async (orderData) => {
  console.log(
    "🔍 Controller - OrderData recibida:",
    JSON.stringify(orderData, null, 2)
  );

  const { orderDate, id_User, paymentMethod, items, paymentStatus } = orderData;
  console.log(
    "🔍 Controller - Items después de destructuring:",
    JSON.stringify(items, null, 2)
  );

  let total = 0;
  const updatedItems = [];
  const transaction = await sequelize.transaction();

  try {
    console.info(">> Iniciando creación de la orden de servicio...");

    // Verificar usuario
    const user = await User.findByPk(id_User, {
      attributes: ["DNI"],
      transaction,
    });
    if (!user) throw new Error(`Usuario con ID ${id_User} no encontrado`);
    console.info(">> Usuario verificado:", user.toJSON());

    if (!user.DNI)
      throw new Error(`Usuario con ID ${id_User} no tiene un DNI registrado`);

    for (const item of items) {
      // Log antes del destructuring del item
      console.log("🔍 Controller - Item antes de destructuring:", {
        item: JSON.stringify(item, null, 2),
        babies: item.babies,
        typeOfBabies: typeof item.babies,
      });

      const { id_Service, date, time, adults, minors, seniors, babies } = item;

      // Log después del destructuring del item
      console.log("🔍 Controller - Item después de destructuring:", {
        babies,
        typeOfBabies: typeof babies,
        originalBabies: item.babies,
      });

      console.info(`>> Procesando ítem con ID de servicio: ${id_Service}`);

      // Verificar servicio
      const excursion = await Service.findByPk(id_Service, { transaction });
      if (!excursion)
        throw new Error(`Servicio con ID ${id_Service} no encontrado`);
      console.info(">> Servicio encontrado:", excursion.toJSON());

      const availability = excursion.availabilityDate.find(
        (avail) => avail.date === date && avail.time === time
      );
      if (!availability) {
        throw new Error(
          `No hay disponibilidad para la fecha ${date} a las ${time} en ${excursion.title}`
        );
      }

      // Los bebés no cuentan para el total de reservaciones
      const totalReservations = adults + minors + seniors;

      const availableStock =
        availability.stock - (availability.lockedStock || 0);

      if (availableStock < totalReservations) {
        throw new Error(
          `Stock insuficiente para ${totalReservations} personas en ${excursion.title}`
        );
      }

      // Bloquear stock
      availability.lockedStock =
        (availability.lockedStock || 0) + totalReservations;

      // Actualizar disponibilidad y lockedStock en la base de datos
      excursion.set(
        "availabilityDate",
        excursion.availabilityDate.map((avail) =>
          avail.date === date && avail.time === time ? availability : avail
        )
      );
      excursion.lockedStock += totalReservations;
      await excursion.save({ transaction });

      // Calcular precios
      const price = parseFloat(excursion.price || 0);
      const itemTotal =
        price * adults +
        price * (1 - (excursion.discountForMinors || 0) / 100) * minors +
        price * (1 - (excursion.discountForSeniors || 0) / 100) * seniors;

      total += itemTotal;

      console.log("Datos antes de pushear a updatedItems:", {
        title: excursion.title,
        adults,
        minors,
        seniors,
        babies, // Ver el valor de babies antes de pushear
        totalPeople: totalReservations,
      });

      updatedItems.push({
        title: excursion.title,
        id_Service,
        date,
        time,
        adults,
        minors,
        seniors,
        babies, // Aquí es donde se usa el valor
        price,
        totalPrice: parseFloat(itemTotal.toFixed(2)),
        totalPeople: totalReservations,
        DNI: user.DNI,
        lockedStock: availability.lockedStock,
      });

      // Log del item después de agregarlo a updatedItems
      console.log("🔍 Controller - Item agregado a updatedItems:", {
        lastItem: updatedItems[updatedItems.length - 1],
        babies: updatedItems[updatedItems.length - 1].babies,
      });
    }

    // Crear orden
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

    console.log("4. Datos para crear orden:", {
      orderDate,
      id_User,
      paymentMethod,
      paymentInformation: updatedItems,
      total: total.toFixed(2),
      paymentStatus,
    });

    // Agregar estos logs
    console.log(
      "updatedItems antes de crear orden:",
      JSON.stringify(updatedItems, null, 2)
    );
    console.log("5. Orden creada:", JSON.stringify(newOrder.toJSON(), null, 2));

    // Asociar servicios
    await newOrder.addServices(
      items.map((item) => item.id_Service),
      { transaction }
    );

    await transaction.commit();
    console.info(">> Orden creada exitosamente:", newOrder.toJSON());
    return newOrder;
  } catch (error) {
    console.error(">> Error al crear la orden:", error.message);
    await transaction.rollback();
    throw new Error(`Error al crear la orden: ${error.message}`);
  }
};

module.exports = createServiceOrderController;
