const deleteServiceByNameController = require('../../controllers/service/deleteServiceByNameController');

const deleteServiceByNameHandler = async (req, res) => {
  try {
    const { name } = req.params;
    const result = await deleteServiceByNameController(name);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = deleteServiceByNameHandler;
