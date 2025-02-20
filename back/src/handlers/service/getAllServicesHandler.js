const getAllServicesController = require('../../controllers/service/getAllServicesController');

const getAllServicesHandler = async (req, res) => {
  try {
    const services = await getAllServicesController();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = getAllServicesHandler;
