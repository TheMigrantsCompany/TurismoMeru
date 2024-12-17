const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Booking', {
    id_Booking: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false // Obligatorio: siempre debe existir un ID
    },
    bookingDate: {
      type: DataTypes.DATE,
      allowNull: false // Obligatorio: necesita una fecha de reserva
    },
    id_User: {
      type: DataTypes.UUID,
      allowNull: false, // Obligatorio: debe asociarse a un usuario
      references: {
        model: 'Users',
        key: 'id_User',
      }
    },
    id_Service: {
      type: DataTypes.UUID,
      allowNull: false, // Obligatorio: debe asociarse a un servicio
      references: {
        model: 'Services',
        key: 'id_Service',
      }
    },
    id_ServiceOrder: {
      type: DataTypes.UUID,
      allowNull: true, // Opcional: puede no haber un pedido de servicio asociado
      references: {
        model: 'ServiceOrders',
        key: 'id_ServiceOrder',
      }
    },
    serviceTitle: { // 
      type: DataTypes.STRING,
      allowNull: false
    },
    DNI_Personal: { // 
      type: DataTypes.STRING,
      allowNull: false
    },
    seatNumber: {
      type: DataTypes.INTEGER,
      allowNull: true // Opcional: el número de asiento puede no ser necesario
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false // Obligatorio: aunque tiene un valor por defecto, se debe especificar
    }
  }, {
    timestamps: true
  });
};
