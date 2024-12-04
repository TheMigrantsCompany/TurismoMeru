const getUserByEmailController = require('../../controllers/user/getUserByEmailController');

const getUserByEmailHandler = async (req, res) => {
  try {
    const { email } = req.params; // Captura el parámetro "email" desde la ruta

    const user = await getUserByEmailController(email);

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = getUserByEmailHandler;
