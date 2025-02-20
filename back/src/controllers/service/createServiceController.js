const { Service } = require('../../config/db');

const createServiceController = async (serviceData) => {
  try {
    console.log('Datos originales del servicio:', serviceData);

    // Validar y procesar `availabilityDate`
    if (serviceData.availabilityDate) {
      serviceData.availabilityDate = serviceData.availabilityDate.map((entry) => {
        if (!entry.date || !entry.time || entry.stock == null) {
          throw new Error('Each availability entry must have a date, time, and stock.');
        }

        // Validar formato de fecha y hora
        const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(entry.date); // YYYY-MM-DD
        const isValidTime = /^\d{2}:\d{2}$/.test(entry.time); // HH:MM
        if (!isValidDate || !isValidTime) {
          throw new Error(`Invalid date or time format: ${entry.date} ${entry.time}`);
        }

        return {
          date: entry.date,
          time: entry.time,
          stock: entry.stock,
        };
      });
    }

    // Crear el servicio en la base de datos
    const newService = await Service.create(serviceData);
    console.log('Nuevo servicio creado:', newService);
    return newService;
  } catch (error) {
    console.error('Error en createServiceController:', error);
    throw new Error('Error creating service: ' + error.message);
  }
};



module.exports = { createServiceController };
