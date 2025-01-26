const { Op } = require('sequelize'); // Importa operadores de Sequelize
const { Booking } = require('../../config/db');

const getBookingsByServiceController = async (id_Service, date, time, page = 1, limit = 10) => {
    if (!id_Service || !date || !time) {
        throw new Error('Faltan parámetros: id_Service, date y time son obligatorios.');
    }

    if (page <= 0 || limit <= 0) {
        throw new Error('Los valores de page y limit deben ser números positivos.');
    }

    const offset = (page - 1) * limit;

    // Construye el valor combinado de fecha y hora
    const dateTime = `${date} ${time}`;

    // Busca las reservas filtrando por id_Service y dateTime
    const { count, rows } = await Booking.findAndCountAll({
        where: {
            id_Service,
            dateTime: {
                [Op.eq]: dateTime, // Filtro exacto por fecha y hora
            },
        },
        order: [['createdAt', 'ASC']],
        limit,
        offset,
    });

    if (rows.length === 0) {
        throw new Error('No se encontraron reservas para este servicio, fecha y hora.');
    }

    return {
        bookings: rows,
        totalBookings: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
    };
};

module.exports = getBookingsByServiceController;
