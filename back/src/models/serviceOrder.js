const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('ServiceOrder', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    orderDate: {
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
    paymentMethod: {
      type: DataTypes.STRING
    },
    paymentInformation: {
      type: DataTypes.STRING
    },
    shippingStatus: {
      type: DataTypes.STRING
    },
    orderQuantity: {
      type: DataTypes.INTEGER
    },
    total: {
      type: DataTypes.DECIMAL(10, 2)
    }
  }, {
    timestamps: true
  });
};
