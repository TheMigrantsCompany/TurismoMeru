const toggleServiceStateController = require('../../controllers/service/toggleServiceStateController');

const toggleServiceStateHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedService = await toggleServiceStateController(id);
    res.status(200).json(updatedService);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = toggleServiceStateHandler;
