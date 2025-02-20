const { User } = require('../../config/db');
const firebase = require('firebase-admin'); // Asegúrate de tener configurada tu conexión a Firebase

const syncUsersController = async () => {
  // Tu lógica para sincronizar usuarios con Firebase
  const users = await User.findAll(); // Obtén todos los usuarios desde la base de datos
  // Aquí iría la lógica de sincronización
  return users;
};

module.exports = syncUsersController;
