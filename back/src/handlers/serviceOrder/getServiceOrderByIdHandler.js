const getServiceOrderByIdController = require('../../controllers/serviceOrder/getServiceOrderByIdController');

const getServiceOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await getServiceOrderByIdController(id);
    res.status(200).json(order);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = getServiceOrderById;
