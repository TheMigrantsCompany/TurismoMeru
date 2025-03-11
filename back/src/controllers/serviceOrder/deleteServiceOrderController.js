const {
  ServiceOrder,
  Service,
  Booking,
  sequelize,
} = require("../../config/db");

const deleteServiceOrderController = async (id_ServiceOrder) => {
  const transaction = await sequelize.transaction();

  try {
    // Obtener la orden con sus bookings usando el alias correcto "bookings"
    const order = await ServiceOrder.findByPk(id_ServiceOrder, {
      include: [
        {
          model: Booking,
          as: "bookings", // Cambiado de "Bookings" a "bookings"
        },
      ],
      transaction,
    });

    if (!order) {
      throw new Error("Orden no encontrada");
    }

    // Obtener información de la orden
    const { paymentStatus, paymentInformation } = order;

    // Para cada item en paymentInformation
    for (const item of paymentInformation) {
      const service = await Service.findByPk(item.id_Service, { transaction });
      if (!service) continue;

      // Encontrar el slot específico en availabilityDate
      const availabilitySlot = service.availabilityDate.find(
        (slot) => slot.date === item.date && slot.time === item.time
      );

      if (availabilitySlot) {
        const totalPeople = item.adults + item.minors + item.seniors;

        if (paymentStatus === "Pendiente") {
          // Si la orden está pendiente, liberar el lockedStock
          availabilitySlot.lockedStock = Math.max(
            0,
            (availabilitySlot.lockedStock || 0) - totalPeople
          );
          service.lockedStock = Math.max(0, service.lockedStock - totalPeople);
        } else if (paymentStatus === "Pagado") {
          // Si la orden está pagada, devolver el stock
          availabilitySlot.stock += totalPeople;
          service.stock += totalPeople;
        }

        // Actualizar availabilityDate del servicio
        service.availabilityDate = service.availabilityDate.map((slot) =>
          slot.date === item.date && slot.time === item.time
            ? availabilitySlot
            : slot
        );

        await service.save({ transaction });
        console.log(`Stock actualizado para servicio ${service.title}`);
      }
    }

    // Eliminar los bookings asociados si existen
    if (order.bookings && order.bookings.length > 0) {
      // Cambiado de Bookings a bookings
      await Booking.destroy({
        where: { id_ServiceOrder },
        transaction,
      });
      console.log("Bookings eliminados");
    }

    // Eliminar la orden
    await order.destroy({ transaction });
    console.log("Orden eliminada");

    await transaction.commit();
    return { message: "Orden eliminada exitosamente" };
  } catch (error) {
    console.error("Error en deleteServiceOrderController:", error);
    await transaction.rollback();
    throw new Error(`Error al eliminar la orden: ${error.message}`);
  }
};

module.exports = deleteServiceOrderController;
