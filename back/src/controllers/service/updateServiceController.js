const { Service } = require('../../config/db');

const updateServiceController = async (id, updateData) => {
  try {
    const service = await Service.findByPk(id);
    if (!service) throw new Error('Service not found');
    await service.update(updateData);
    return service;
  } catch (error) {
    throw new Error('Error updating service: ' + error.message);
  }
};

module.exports = updateServiceController;
