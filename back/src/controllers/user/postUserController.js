const { User } = require('../../config/db');

const postUserController = async (userData) => {
  const { email } = userData;

  // Verificar si ya existe un usuario con el mismo correo
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    // Si el usuario ya existe, retornar el usuario existente con su rol
    return existingUser;
  }

  // Lista de correos que deben tener el rol de admin
  const adminEmails = [
    'franciscomeruviajes@gmail.com',
    'agusramos12@gmail.com',
    'iaba.sur@gmail.com',
    'meruevt@gmail.com',
  ];

  // Determinar el rol del usuario
  const role = adminEmails.includes(email) ? 'admin' : 'customer';
  
  // Asignar el rol al userData
  userData.role = role;

  // Crear el nuevo usuario
  const newUser = await User.create(userData);
  return newUser;
};

module.exports = postUserController;
