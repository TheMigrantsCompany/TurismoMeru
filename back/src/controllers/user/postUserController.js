const { User } = require('../../config/db');

const postUserController = async (userData) => {
  const { email } = userData;

  // Verificar si ya existe un usuario con el mismo correo
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('El usuario con ese correo ya existe');
  }

  // Lista de correos que deben tener el rol de admin
  const adminEmails = [
    'franciscomeruviajes@gmail.com',
    'lautiu9@gmail.com',
    'agusramos12@gmail.com',
    'iaba.sur@gmail.com',
  ];

  // Determinar el rol del usuario
  const role = adminEmails.includes(email) ? 'admin' : 'customer';
  
  // Asignar el rol al userData
  userData.role = role;

  // Creación del nuevo usuario
  const newUser = await User.create(userData);
  return newUser;
};

module.exports = postUserController;