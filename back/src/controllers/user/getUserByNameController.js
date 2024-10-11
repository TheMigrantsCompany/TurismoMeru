const { User } = require('../../config/db');
const { Op } = require('sequelize');

const getUserByNameController = async (name) => {
    if (name.length < 3) {
        throw new Error('El nombre debe tener al menos 3 caracteres');
      }
    
      const users = await User.findAll({
        where: {
          name: {
            [Op.iLike]: `%${name}%`, // Búsqueda insensible a mayúsculas/minúsculas
          },
        },
      });
    
      if (users.length === 0) {
        throw new Error('No se encontraron usuarios');
      }
      return users;
};

module.exports = getUserByNameController;


  