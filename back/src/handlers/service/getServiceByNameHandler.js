const getServicesByNameController = require('../../controllers/service/getServiceByNameController');

const getServicesByNameHandler = async (req, res) => {
  try {
    const { name } = req.params; // Obtenemos el nombre del servicio desde los parámetros de la URL
    const services = await getServicesByNameController(name);
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = getServicesByNameHandler;
