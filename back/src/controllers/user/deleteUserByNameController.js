const { User } = require('../../config/db');
const { Op } = require('sequelize');

const deleteUserByNameController = async (name) => {
  const user = await User.findOne({
    where: {
      name: {
        [Op.iLike]: `%${name}%`
      }
    }
  });
  
  if (!user) return null;

  await user.destroy();
  return user;
};

module.exports = deleteUserByNameController;
