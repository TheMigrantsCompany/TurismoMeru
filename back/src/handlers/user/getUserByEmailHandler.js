const getUserByEmailController = require("../../controllers/user/getUserByEmailController");
const verifyToken = require("../../middlewares/verifyToken");

const getUserByEmailHandler = async (req, res) => {
  try {
    const { email } = req.params;

    // Primero verificamos el token
    await verifyToken(req, res, async () => {
      try {
        const user = await getUserByEmailController(email);
        res.status(200).json(user);
      } catch (error) {
        res.status(404).json({ message: error.message });
      }
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

module.exports = getUserByEmailHandler;
