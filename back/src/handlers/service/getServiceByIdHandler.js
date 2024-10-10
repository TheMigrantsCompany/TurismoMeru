const getServiceByIdController = require('../../controllers/service/getServiceByIdController');

const getServiceByIdHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await getServiceByIdController(id);
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = getServiceByIdHandler;
