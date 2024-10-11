const postUserController = require('../../controllers/user/postUserController');

const postUserHandler = async (req, res) => {
  try {
    const newUser = await postUserController(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = postUserHandler;
