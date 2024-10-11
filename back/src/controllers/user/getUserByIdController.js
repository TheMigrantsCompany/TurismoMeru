const { User } = require('../../config/db');

const getUserByIdController = async (id) => {
  const user = await User.findByPk(id);
  return user;
};

module.exports = getUserByIdController;
