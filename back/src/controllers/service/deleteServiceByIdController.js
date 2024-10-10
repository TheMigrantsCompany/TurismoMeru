const { Service } = require('../../config/db');

const deleteServiceByIdController = async (id) => {
  try {
    const service = await Service.findByPk(id);
    if (!service) throw new Error('Service not found');
    await service.destroy();
  } catch (error) {
    throw new Error('Error deleting service by ID: ' + error.message);
  }
};

module.exports = deleteServiceByIdController;
