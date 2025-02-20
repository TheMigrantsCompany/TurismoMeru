const deleteUserByIdController = require('../../controllers/user/deleteUserByIdController');

const deleteUserByIdHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await deleteUserByIdController(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = deleteUserByIdHandler;
