const { Console } = require('console');
const { Booking, Service } = require('../../config/db'); // Importa los modelos

const createBookingController = async (id_User, paymentStatus, paymentInformation, id_ServiceOrder) => {
  try {
    const bookings = [];

    console.log('Inicio de la creación de reservas');
    console.log('User ID:', id_User);
    console.log('Payment Status:', paymentStatus);
    console.log('Payment Information:', paymentInformation);
    
    // Verifica que paymentInformation sea un arreglo
    if (!Array.isArray(paymentInformation)) {
      throw new Error('paymentInformation debe ser un arreglo');
    }

    for (const { id_Service, quantity } of paymentInformation) {
      console.log('Procesando servicio:', id_Service, 'con cantidad:', quantity);
      
      const service = await Service.findByPk(id_Service);
  
      // Verifica que el servicio exista y que tenga stock disponible
      if (!service) {
        console.log(`El servicio con ID ${id_Service} no existe.`);
        throw new Error(`El servicio con ID ${id_Service} no existe.`);
      }

      const service_ = service.dataValues;

      console.log('Servicio encontrado:', service_);
      
      // Verifica el stock disponible
      if (service_.stock < quantity) {
        console.log(`No hay suficiente stock para el servicio ${service.title}.`);
        throw new Error(`No hay suficiente stock para el servicio ${service.title}.`);
      }
      
      // Encuentra el último número de asiento asignado para el servicio
      const lastBooking = await Booking.findOne({
        where: { id_Service: id_Service },
        order: [['seatNumber', 'DESC']],
      });

      const lastSeatNumber = lastBooking ? lastBooking.seatNumber : 0;

      console.log(`Último asiento asignado: ${lastSeatNumber}`);

      // Descuenta el stock del servicio
      await service.update({ stock: service_.stock - quantity });
      console.log('Stock actualizado para el servicio:', service);

      // Genera reservas para cada persona, asignando los números de asiento secuencialmente
      for (let i = 0; i < quantity; i++) {
        const seatNumber = lastSeatNumber + i + 1; // Asigna el siguiente número de asiento disponible

        const booking = await Booking.create({
          id_User,
          id_Service,
          serviceTitle: service.title,
          id_ServiceOrder,
          bookingDate: new Date(),
          paymentStatus,
          DNI_Personal: "null", // Reemplaza esto con el valor real si es necesario
          seatNumber,
          active: true
        });

        console.log(`Reserva creada para asiento ${seatNumber}`);

        bookings.push(booking);
      }
    }
    
    return bookings;
    
  } catch (error) {
    console.error('Error en createBookingController:', error.message);
    throw error; // Lanza el error para que pueda ser manejado en el controlador
  }
};

module.exports = createBookingController;