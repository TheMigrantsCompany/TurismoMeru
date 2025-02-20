const { User } = require('../../config/db'); // Asegúrate de que esta importación sea correcta

const toggleUserActiveController = async (id) => {
try {    
  const user = await User.findByPk(id);
  if (!user) throw new Error('User not found');
  user.active = !user.active;
  await user.save();
  return user;
}catch (error) {
    throw new Error('Error toggling user state: ' + error.message);
  }
};

module.exports = toggleUserActiveController;
