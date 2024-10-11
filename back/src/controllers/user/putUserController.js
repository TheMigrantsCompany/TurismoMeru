const { User } = require('../../config/db');

const putUserController = async (id, updatedData) => {
  const user = await User.findByPk(id);
  if (!user) return null;

  await user.update(updatedData);
  return user;
};

module.exports = putUserController;
