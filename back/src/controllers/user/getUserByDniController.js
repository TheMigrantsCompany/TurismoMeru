const { User } = require('../../config/db');

const getUserByDniController = async (DNI) => {
  const user = await User.findAll({
    where: { DNI }, // Busca el usuario donde el campo 'dni' coincida con el valor proporcionado
  });
  return user;
};

module.exports = getUserByDniController;
