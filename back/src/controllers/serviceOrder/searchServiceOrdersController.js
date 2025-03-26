const { ServiceOrder } = require('../../config/db');
const { sequelize } = require('../../config/db');

const searchServicesOrders = async (title, date) => {
  try {
    const cleanTitle = title.trim().toLowerCase();
    const cleanDate = Array.isArray(date) ? date[0] : date; // Usa solo un valor de date

   // console.log(`Buscando órdenes con title: ${cleanTitle} y date: ${cleanDate}`);

    const query = `(
      SELECT 1
      FROM jsonb_array_elements("ServiceOrder"."paymentInformation") AS info
      WHERE
        LOWER(info->>'title') LIKE LOWER('%${cleanTitle}%')
        ${cleanDate ? `AND info->>'date' = '${cleanDate}'` : ''}
    )`;

    const orders = await ServiceOrder.findAll({
      where: sequelize.where(
        sequelize.fn('EXISTS', sequelize.literal(query)),
        true
      ),
    });

    //console.log('Órdenes encontradas:', orders);

    if (orders.length === 0) {
      throw new Error('No se encontraron órdenes con los filtros aplicados');
    }

    return orders;
  } catch (error) {
    console.error('Error en la búsqueda de órdenes:', error.message);
    throw new Error(`Error al buscar las órdenes: ${error.message}`);
  }
};

module.exports = { searchServicesOrders };
