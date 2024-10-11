const toggleUserActiveController = require('../../controllers/user/toggleUserActiveController');

const toggleUserActiveHandler = async (req, res) => {
  try {
    const { id } = req.params; // Obtener el ID del usuario de los parámetros de la ruta

    // Llamar al controlador para alternar el estado 'active'
    const updatedUser = await toggleUserActiveController(id);
    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Retornar el usuario actualizado
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = toggleUserActiveHandler;
