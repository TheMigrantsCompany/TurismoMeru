const deleteServiceByIdController = require('../../controllers/service/deleteServiceByIdController');

const deleteServiceByIdHandler = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteServiceByIdController(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = deleteServiceByIdHandler;
