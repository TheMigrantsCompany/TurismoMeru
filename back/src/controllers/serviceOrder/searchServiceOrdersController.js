const { ServiceOrder } = require('../../config/db');
const { Op } = require('sequelize');
const { sequelize } = require('../../config/db'); // Asegurarse de importar sequelize si es necesario

const searchServicesOrders = async (title) => {
  try {
    // Convertir tanto el título a buscar como los títulos en el JSONB a minúsculas
    const orders = await ServiceOrder.findAll({
      where: sequelize.where(
        sequelize.fn('LOWER', sequelize.cast(sequelize.json('paymentInformation'), 'text')),
        {
          [Op.like]: `%${title.toLowerCase()}%`
        }
      )
    });

    if (orders.length === 0) {
      throw new Error('No se encontraron órdenes con la excursión solicitada');
    }

    return orders;
  } catch (error) {
    throw new Error(`Error al buscar las órdenes: ${error.message}`);
  }
};

module.exports = { searchServicesOrders };
