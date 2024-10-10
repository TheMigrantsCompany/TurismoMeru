const { Service } = require('../../config/db');

const getAllServicesController = async () => {
  try {
    return await Service.findAll();
  } catch (error) {
    throw new Error('Error fetching services: ' + error.message);
  }
};

module.exports = getAllServicesController;
