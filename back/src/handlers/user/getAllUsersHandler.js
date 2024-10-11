const getAllUsersController = require('../../controllers/user/getAllUsersController');

const getAllUsersHandler = async (req, res) => {
  try {
    const users = await getAllUsersController();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = getAllUsersHandler;
