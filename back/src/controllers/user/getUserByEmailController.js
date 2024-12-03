const { User } = require('../../config/db');

const getUserByEmailController = async (email) => {
  if (!email || typeof email !== 'string') {
    throw new Error('El correo electrónico es obligatorio y debe ser un texto válido');
  }

  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error('No se encontró un usuario con este correo electrónico');
  }

  return user;
};

module.exports = getUserByEmailController;
