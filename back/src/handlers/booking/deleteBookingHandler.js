const deleteBookingController = require('../../controllers/booking/deleteBookingController'); // Cambia la ruta según tu estructura

const deleteBookingHandler = async (req, res) => {
  const { id_Booking } = req.params; // Obtiene el ID de la reserva desde los parámetros

  try {
    // Llama al controlador de eliminación
    await deleteBookingController(id_Booking);

    return res.status(200).json({
      message: 'Reserva eliminada exitosamente',
    });
  } catch (error) {
    return res.status(400).json({
      message: 'Error al eliminar la reserva',
      error: error.message,
    });
  }
};

module.exports = deleteBookingHandler;
