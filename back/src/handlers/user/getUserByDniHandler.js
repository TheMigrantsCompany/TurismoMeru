const getUserByDniController = require('../../controllers/user/getUserByDniController');

const getUserByDniHandler = async (req, res) => {
  const { dni } = req.params; // Suponiendo que el DNI viene como un parámetro de la ruta
  try {
    const user = await getUserByDniController(dni);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = getUserByDniHandler;
