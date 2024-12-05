const { Service } = require('../../config/db');

const createServiceController = async (serviceData) => {
  try {
    const newService = await Service.create(serviceData);
    return newService;
  } catch (error) {
    throw new Error('Error creating service: ' + error.message);
  }
};

module.exports = createServiceController;