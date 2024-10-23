const { searchServicesOrders } = require('../../controllers/serviceOrder/searchServiceOrdersController');

const searchServiceOrderHandler = async (req, res) => {
  const { title } = req.params; // Obtenemos el nombre de la excursión del query param
  console.log(title);
  if (!title) {
    return res.status(400).json({ message: 'El nombre de la excursión es requerido' });
  }

  try {
    const orders = await searchServicesOrders(title);
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports =   searchServiceOrderHandler;
