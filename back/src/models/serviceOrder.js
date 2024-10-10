const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('ServiceOrder', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false // Obligatorio: siempre debe existir un ID
    },
    orderDate: {
      type: DataTypes.DATE,
      allowNull: false // Obligatorio: debe haber una fecha de pedido
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false, // Obligatorio: debe asociarse a un usuario
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    serviceId: {
      type: DataTypes.UUID,
      allowNull: false, // Obligatorio: debe asociarse a un servicio
      references: {
        model: 'Services',
        key: 'id'
      }
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true // Opcional: puede no ser necesario especificar un método de pago
    },
    paymentInformation: {
      type: DataTypes.STRING,
      allowNull: true // Opcional: puede no ser necesario especificar información de pago
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false // Obligatorio: el total del pedido es necesario
    }
  }, {
    timestamps: true
  });
};
