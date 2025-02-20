const deleteUserByNameController = require('../../controllers/user/deleteUserByNameController');

const deleteUserByNameHandler = async (req, res) => {
  try {
    const { name } = req.params;
    const deletedUser = await deleteUserByNameController(name);
    if (!deletedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = deleteUserByNameHandler;
