const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Booking', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    bookingDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    serviceId: {
      type: DataTypes.UUID,
      references: {
        model: 'Services',
        key: 'id'
      }
    },
    serviceOrderId: {
      type: DataTypes.UUID,
      references: {
        model: 'ServiceOrders',
        key: 'id'
      }
    },
    paymentStatus: {
      type: DataTypes.STRING
    },
    seatNumber: {
      type: DataTypes.INTEGER
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    timestamps: true
  });
};
