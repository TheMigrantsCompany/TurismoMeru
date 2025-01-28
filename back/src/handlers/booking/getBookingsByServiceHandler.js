const getBookingsByServiceController = require('../../controllers/booking/getBookingsByServiceController');

const getBookingsByServiceHandler = async (req, res) => {
    const { id_Service } = req.params; // `id_Service` desde los parámetros de la URL
    const { date, time, page = 1, limit = 10 } = req.query; // `date`, `time`, `page` y `limit` desde la query string

    try {
        // Validar que id_Service, date y time están presentes
        if (!id_Service || !date || !time) {
            return res.status(400).json({
                message: 'Faltan parámetros: id_Service, date y time son obligatorios.',
            });
        }

        // Validar que `date` sea una fecha válida
        if (isNaN(Date.parse(date))) {
            return res.status(400).json({
                message: 'El parámetro date debe ser una fecha válida (YYYY-MM-DD).',
            });
        }

        // Validar que `time` tenga el formato correcto (HH:mm)
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        if (!timeRegex.test(time)) {
            return res.status(400).json({
                message: 'El parámetro time debe tener el formato HH:mm (por ejemplo, 08:00).',
            });
        }

        // Validar que `page` y `limit` sean números positivos
        if (page <= 0 || limit <= 0 || isNaN(page) || isNaN(limit)) {
            return res.status(400).json({
                message: 'Los parámetros page y limit deben ser números positivos.',
            });
        }

        // Llamar al controlador con los parámetros validados
        const data = await getBookingsByServiceController(id_Service, date, time, parseInt(page), parseInt(limit));

        res.status(200).json({
            message: 'Reservas encontradas exitosamente.',
            data,
        });
    } catch (error) {
        console.error('Error al obtener las reservas:', error.message);
        res.status(500).json({
            message: 'Error al obtener las reservas.',
            error: error.message,
        });
    }
};

module.exports = getBookingsByServiceHandler;