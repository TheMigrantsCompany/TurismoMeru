const updateServiceController = require('../../controllers/service/updateServiceController');

const updateServiceHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedService = await updateServiceController(id, updateData);
    res.status(200).json(updatedService);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = updateServiceHandler;
