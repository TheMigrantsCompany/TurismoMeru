const { User } = require('../../config/db');

const deleteUserByIdController = async (id_User) => {
  const user = await User.findByPk(id_User);
  if (!user) return null;

  await user.destroy();
  return user;
};

module.exports = deleteUserByIdController;
