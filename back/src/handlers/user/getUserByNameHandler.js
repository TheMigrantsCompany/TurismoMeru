const getUserByNameController = require('../../controllers/user/getUserByNameController');

const getUserByNameHandler = async (req, res) => {
  try {
    const { name } = req.params;
    const users = await getUserByNameController(name);
    
    if (!users.length) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = getUserByNameHandler;
