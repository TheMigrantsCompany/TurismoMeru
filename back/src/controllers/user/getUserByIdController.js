const { User } = require('../../config/db');

const getUserByIdController = async (id_User) => {
  const user = await User.findByPk(id_User);
  return user;
};

module.exports = getUserByIdController;
