const { Service } = require('../../config/db');
const { Op } = require('sequelize');

const getServicesByNameController = async (name) => {
  try {
    // Verificar que el nombre del servicio sea válido
    if (!name || name.length < 3) {
      throw new Error("Service name parameter must be at least 3 characters long");
    }

    // Buscar servicios con nombres similares (mínimo 3 caracteres) sin tener en cuenta mayúsculas/minúsculas
    const services = await Service.findAll({
      where: {
        title: {
          [Op.iLike]: `%${name}%` // Buscamos el nombre con similitud de 3 caracteres
        }
      }
    });

    // Si no se encuentran servicios, lanzar un error
    if (services.length === 0) {
      throw new Error(`No services found with names similar to "${name}"`);
    }

    return services; // Retornar todos los servicios que coincidan
  } catch (error) {
    throw new Error('Error fetching services: ' + error.message);
  }
};

module.exports = getServicesByNameController;
