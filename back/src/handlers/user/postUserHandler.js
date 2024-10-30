const postUserController = require('../../controllers/user/postUserController');
const verifyToken = require('../../middlewares/verifyToken');

const postUserHandler = async (req, res) => {
  try {
    // Llama al middleware `verifyToken` para autenticar el token
    await verifyToken(req, res, async () => {
      // Luego, llama al controlador para crear el usuario
      const newUser = await postUserController(req.body);
      res.status(201).json(newUser);
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = postUserHandler;
