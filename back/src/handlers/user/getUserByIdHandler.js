const getUserByIdController = require('../../controllers/user/getUserByIdController');

const getUserByIdHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getUserByIdController(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = getUserByIdHandler;
