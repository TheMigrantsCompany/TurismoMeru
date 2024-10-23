const { ServiceOrder } = require('../../config/db');

const getServiceOrdersController = async () => {
  try {
    const orders = await ServiceOrder.findAll();
    return orders;
  } catch (error) {
    throw new Error('Error fetching service orders');
  }
};

module.exports = getServiceOrdersController;
