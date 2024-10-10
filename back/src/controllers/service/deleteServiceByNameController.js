const { Service } = require('../../config/db');
const { Op } = require('sequelize');

const deleteServiceByNameController = async (Name_Service) => {
  try {
    // Verificar que el nombre del servicio sea válido
    if (!Name_Service) {
      throw new Error("Service name parameter is required");
    }

    // Buscar el servicio con el nombre sin importar la capitalización
    const service = await Service.findOne({
      where: {
        title: {
          [Op.iLike]: Name_Service // Buscamos el servicio sin tener en cuenta mayúsculas/minúsculas
        }
      }
    });

    if (!service) {
      throw new Error(`No service found with the exact name "${Name_Service}"`);
    }

    await service.destroy();
    return { message: `Service "${service.title}" deleted successfully` };
  } catch (error) {
    throw new Error('Error deleting service: ' + error.message);
  }
};

module.exports = deleteServiceByNameController;
