const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('ServiceOrder', {
    id_ServiceOrder: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    orderDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    id_User: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id_User'
      }
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paymentInformation: {
      type: DataTypes.JSONB,
      allowNull: true //
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    paymentStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Pendiente' // Puede ser "Pendiente" o "Pagado"
    }
  }, {
    timestamps: true
  });
};