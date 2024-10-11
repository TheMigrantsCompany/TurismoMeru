const { User } = require('../../config/db');

const deleteUserByIdController = async (id) => {
  const user = await User.findByPk(id);
  if (!user) return null;

  await user.destroy();
  return user;
};

module.exports = deleteUserByIdController;
