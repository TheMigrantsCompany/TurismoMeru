const getBookingsByServiceController = require('../../controllers/booking/getBookingsByServiceController');

const getBookingsByServiceHandler = async (req, res) => {
    const { id_Service } = req.params;

    console.log(`Request recibido: id_Service=${id_Service}`);
  
    try {
        // Recuperar todas las reservas asociadas con el id_Service
        const bookings = await getBookingsByServiceController(id_Service);
        
        console.log(`Bookings encontrados: ${JSON.stringify(bookings)}`);
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error al obtener las reservas:', error.message);
        res.status(500).json({ error: error.message });
    }
};

module.exports = getBookingsByServiceHandler;
