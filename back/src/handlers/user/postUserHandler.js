const postUserController = require("../../controllers/user/postUserController");
const verifyToken = require("../../middlewares/verifyToken");

const postUserHandler = async (req, res) => {
  try {
    await verifyToken(req, res, async () => {
      try {
        const userData = {
          ...req.body,
          email: req.user.email, // Usar el email verificado del token
        };

        const newUser = await postUserController(userData);
        res.status(201).json(newUser);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

module.exports = postUserHandler;
