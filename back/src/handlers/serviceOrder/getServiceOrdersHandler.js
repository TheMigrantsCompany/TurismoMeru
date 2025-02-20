const getServiceOrdersController = require('../../controllers/serviceOrder/getServiceOrdersController');

const getServiceOrders = async (req, res) => {
  try {
    const orders = await getServiceOrdersController();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = getServiceOrders;
