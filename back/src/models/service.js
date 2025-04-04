const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Service', {
    id_Service: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false // Obligatorio: siempre debe existir un ID
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false // Obligatorio: el título del servicio es necesario
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false // Obligatorio: la descripción del servicio es necesaria
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false // Obligatorio: el precio es necesario
    },
    discountForMinors: {
      type: DataTypes.INTEGER, // Enteros para representar descuentos (10, 20, 30, etc.)
      allowNull: true, // Opcional, puede no aplicarse un descuento
      defaultValue: 0 // Por defecto, no hay descuento
    },
    discountForSeniors: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true // Opcional: puede no ser necesario especificar la duración
    },
    difficulty: {
      type: DataTypes.STRING,
      allowNull: true // Opcional: puede no ser necesario especificar la dificultad
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true // Opcional: puede no ser necesario especificar la ubicación
    },
    availabilityDate: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    photos: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true // Opcional: puede no ser necesario especificar la categoría
    },
    meetingPoint: {
      type: DataTypes.STRING,
      allowNull: true // Opcional: puede no ser necesario especificar un punto de encuentro
    },
    requirements: {
      type: DataTypes.TEXT,
      allowNull: true // Opcional: puede no haber requisitos específicos
    },
    cancellationPolicy: {
      type: DataTypes.TEXT,
      allowNull: true // Opcional: puede no haber una política de cancelación específica
    },
    additionalEquipment: {
      type: DataTypes.TEXT,
      allowNull: true // Opcional: puede no haber equipo adicional necesario
    },
    guides: {
      type: DataTypes.JSON,
      allowNull: true // Opcional: puede no haber guías disponibles inicialmente
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false // Obligatorio: debe haber un número de cupos disponibles
    },
    lockedStock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false, // Por defecto, ningún stock está bloqueado
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, // Valor por defecto
      allowNull: false // Obligatorio: el estado de actividad debe estar definido
    }
  }, {
    timestamps: false
  });
};