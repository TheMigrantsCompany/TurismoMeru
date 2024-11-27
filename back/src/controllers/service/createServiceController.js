const { Service } = require('../../config/db');

const createServiceController = async (serviceData) => {
  try {
    // Aplicar los descuentos al precio base
    let finalPrice = parseFloat(serviceData.price);
    if (serviceData.discountForMinors) {
      finalPrice -= (finalPrice * serviceData.discountForMinors) / 100;
    }
    if (serviceData.discountForSeniors) {
      finalPrice -= (finalPrice * serviceData.discountForSeniors) / 100;
    }

    // Agregar el precio final al objeto de datos
    serviceData.finalPrice = finalPrice;

    const newService = await Service.create(serviceData);
    return newService;
  } catch (error) {
    throw new Error('Error al crear el servicio: ' + error.message);
  }
};

module.exports = createServiceController;

