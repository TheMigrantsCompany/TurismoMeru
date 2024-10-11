const { User } = require('../../config/db');

const getAllUsersController = async () => {
  const users = await User.findAll({
    order: [['name', 'ASC']], // Ordenar alfabéticamente por el campo 'name'
  });
  return users;
};

module.exports = getAllUsersController;
