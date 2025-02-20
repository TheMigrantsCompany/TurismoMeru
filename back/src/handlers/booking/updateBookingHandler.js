const updateBookingController = require('../../controllers/booking/updateBookingController'); // Cambia la ruta según tu estructura

const updateBookingHandler = async (req, res) => {
  const { id_Booking } = req.params; // Obtiene el ID de la reserva desde los parámetros
  const updateData = req.body; // Obtiene los datos a actualizar desde el cuerpo de la solicitud

  // Validar que los campos necesarios están presentes
  if (!updateData.DNI && !updateData.seatNumber) {
    return res.status(400).json({
      message: 'Debe proporcionar al menos el DNI o el número de asiento para actualizar la reserva.',
    });
  }

  try {
    // Llama al controlador de actualización
    const updatedBooking = await updateBookingController(id_Booking, updateData);

    return res.status(200).json({
      message: 'Reserva actualizada exitosamente',
      booking: updatedBooking,
    });
  } catch (error) {
    // Aquí podrías hacer un manejo más detallado dependiendo del tipo de error
    return res.status(400).json({
      message: 'Error al actualizar la reserva',
      error: error.message,
    });
  }
};

module.exports = updateBookingHandler;
