const { ServiceOrder, Service, User, sequelize } = require("../../config/db");

const createServiceOrderController = async (orderData) => {
  const { orderDate, id_User, paymentMethod, items, paymentStatus } = orderData;

  let total = 0;
  const updatedItems = [];
  const transaction = await sequelize.transaction();

  try {
    console.info(">> Iniciando creación de la orden de servicio...");

    // Verificar usuario
    const user = await User.findByPk(id_User, { attributes: ["DNI"], transaction });
    if (!user) throw new Error(`Usuario con ID ${id_User} no encontrado`);
    console.info(">> Usuario verificado:", user.toJSON());

    if (!user.DNI) throw new Error(`Usuario con ID ${id_User} no tiene un DNI registrado`);

    for (const item of items) {
      const { id_Service, date, time, adults, minors, seniors } = item;
      console.info(`>> Procesando ítem con ID de servicio: ${id_Service}`);

      // Verificar servicio
      const excursion = await Service.findByPk(id_Service, { transaction });
      if (!excursion) throw new Error(`Servicio con ID ${id_Service} no encontrado`);
      console.info(">> Servicio encontrado:", excursion.toJSON());

      const availability = excursion.availabilityDate.find(
        (avail) => avail.date === date && avail.time === time
      );
      if (!availability) {
        throw new Error(
          `No hay disponibilidad para la fecha ${date} a las ${time} en ${excursion.title}`
        );
      }

      const totalReservations = adults + minors + seniors;
      const availableStock = availability.stock - (availability.lockedStock || 0);

      if (availableStock < totalReservations) {
        throw new Error(
          `Stock insuficiente para ${totalReservations} personas en ${excursion.title}`
        );
      }

      // Bloquear stock
availability.lockedStock = (availability.lockedStock || 0) + totalReservations;

// Actualizar disponibilidad y lockedStock en la base de datos
excursion.set(
  "availabilityDate",
  excursion.availabilityDate.map((avail) =>
    avail.date === date && avail.time === time ? availability : avail
  )
);
excursion.lockedStock += totalReservations; // Incrementar el lockedStock general
await excursion.save({ transaction }); // Guardar los cambios
console.info(">> Disponibilidad y lockedStock actualizados para el servicio:", excursion.title);

      // Calcular precios
      const price = parseFloat(excursion.price || 0);
      const itemTotal =
        price * adults +
        price * (1 - (excursion.discountForMinors || 0) / 100) * minors +
        price * (1 - (excursion.discountForSeniors || 0) / 100) * seniors;

      total += itemTotal;

      updatedItems.push({
        title: excursion.title,
        id_Service,
        date,
        time,
        adults,
        minors,
        seniors,
        price,
        totalPrice: parseFloat(itemTotal.toFixed(2)),
        totalPeople: totalReservations,
        DNI: user.DNI,
        lockedStock: availability.lockedStock,
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

    // Asociar servicios
    await newOrder.addServices(items.map((item) => item.id_Service), { transaction });

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
