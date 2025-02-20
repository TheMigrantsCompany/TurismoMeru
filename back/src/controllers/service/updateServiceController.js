const { Service } = require('../../config/db');

const updateServiceController = async (id, updateData) => {
  try {
    // Buscar el servicio por ID
    const service = await Service.findByPk(id);
    if (!service) throw new Error('Service not found');

    // Si los descuentos están presentes, recalcular el precio final
    let finalPrice = parseFloat(updateData.price || service.price);  // Usa el precio proporcionado o el existente
    if (updateData.discountForMinors) {
      finalPrice -= (finalPrice * updateData.discountForMinors) / 100;
    }
    if (updateData.discountForSeniors) {
      finalPrice -= (finalPrice * updateData.discountForSeniors) / 100;
    }

    // Agregar el precio final calculado a los datos de actualización
    updateData.finalPrice = finalPrice;

    // Actualizar el servicio con los datos nuevos
    await service.update(updateData);

    return service; // Retornar el servicio actualizado
  } catch (error) {
    throw new Error('Error updating service: ' + error.message);
  }
};

module.exports = updateServiceController;
