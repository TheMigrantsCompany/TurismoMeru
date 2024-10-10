const { Service } = require('../../config/db');

const toggleServiceStateController = async (id) => {
  try {
    const service = await Service.findByPk(id);
    if (!service) throw new Error('Service not found');
    service.active = !service.active;
    await service.save();
    return service;
  } catch (error) {
    throw new Error('Error toggling service state: ' + error.message);
  }
};

module.exports = toggleServiceStateController;
