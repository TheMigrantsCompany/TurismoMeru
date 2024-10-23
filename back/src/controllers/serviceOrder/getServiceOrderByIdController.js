const { ServiceOrder } = require('../../config/db');

const getServiceOrderByIdController = async (id) => {
  try {
    const order = await ServiceOrder.findByPk(id);
    if (!order) throw new Error('Service order not found');
    return order;
  } catch (error) {
    throw new Error('Error fetching service order');
  }
};

module.exports = getServiceOrderByIdController;
