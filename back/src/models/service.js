const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Service', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    duration: {
      type: DataTypes.INTEGER
    },
    difficulty: {
      type: DataTypes.STRING
    },
    location: {
      type: DataTypes.STRING
    },
    availabilityDate: {
      type: DataTypes.DATE
    },
    photos: {
      type: DataTypes.JSON
    },
    category: {
      type: DataTypes.STRING
    },
    meetingPoint: {
      type: DataTypes.STRING
    },
    requirements: {
      type: DataTypes.TEXT
    },
    cancellationPolicy: {
      type: DataTypes.TEXT
    },
    additionalEquipment: {
      type: DataTypes.TEXT
    },
    guides: {
      type: DataTypes.JSON
    },
    stock: {
      type: DataTypes.INTEGER
    }
  }, {
    timestamps: true
  });
};
