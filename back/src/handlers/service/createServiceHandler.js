const { createServiceController } = require('../../controllers/service/createServiceController');

const createServiceHandler = async (req, res) => {
  try {
    const serviceData = req.body;

    console.log('Datos recibidos del cliente:', serviceData);

    const newService = await createServiceController(serviceData);

    res.status(201).json(newService);
  } catch (error) {
    console.error('Error en createServiceHandler:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = createServiceHandler;
