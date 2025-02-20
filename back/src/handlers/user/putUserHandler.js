const putUserController = require('../../controllers/user/putUserController');

const putUserHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await putUserController(id, req.body);
    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = putUserHandler;
