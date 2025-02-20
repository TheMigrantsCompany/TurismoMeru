const { searchServicesOrders } = require('../../controllers/serviceOrder/searchServiceOrdersController');

const searchServiceOrderHandler = async (req, res) => {
  const { title } = req.params; // Título del parámetro de ruta
  const { date } = req.query; // Fecha del query param

  if (!title) {
    return res.status(400).json({ message: 'El nombre de la excursión es requerido' });
  }

  try {
    const orders = await searchServicesOrders(title, date);
    return res.status(200).json({
      message: 'Órdenes encontradas exitosamente.',
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener las órdenes',
      error: error.message,
    });
  }
};

module.exports = searchServiceOrderHandler;
