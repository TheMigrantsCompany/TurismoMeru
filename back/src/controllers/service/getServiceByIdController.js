const { Service } = require('../../config/db');

const getServiceByIdController = async (id) => {
  try {
    const service = await Service.findByPk(id);
    if (!service) throw new Error('Service not found');
    return service;
  } catch (error) {
    throw new Error('Error fetching service by ID: ' + error.message);
  }
};

module.exports = getServiceByIdController;
