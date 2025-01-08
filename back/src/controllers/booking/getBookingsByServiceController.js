const { Booking } = require('../../config/db');

const getBookingsByServiceController = async (id_Service) => {
    // Buscar todas las reservas asociadas al servicio
    const bookings = await Booking.findAll({
        where: {
            id_Service: id_Service, // Filtro por id_Service
        },
        order: [['createdAt', 'ASC']], // Ordenar por la fecha de creación
    });

    if (bookings.length === 0) {
        console.log(`No se encontraron reservas para el servicio con id "${id_Service}".`);
        throw new Error('No se encontraron reservas para este servicio.');
    }

    console.log(`Reservas encontradas: ${JSON.stringify(bookings)}`);
    return bookings;
};

module.exports = getBookingsByServiceController;
