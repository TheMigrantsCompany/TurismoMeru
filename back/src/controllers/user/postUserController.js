const { User } = require('../../config/db');

const postUserController = async (userData) => {
  const { email } = userData;

  // Verificar si ya existe un usuario con el mismo correo
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('El usuario con ese correo ya existe');
  }

  // Creación del nuevo usuario
  const newUser = await User.create(userData);
  return newUser;
};

module.exports = postUserController;
