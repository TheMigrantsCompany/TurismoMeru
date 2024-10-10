const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Service', {
    id: {
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
      type: DataTypes.DATE,
      allowNull: true // Opcional: puede no ser necesario especificar la fecha de disponibilidad
    },
    photos: {
      type: DataTypes.JSON,
      allowNull: true // Opcional: puede no haber fotos disponibles inicialmente
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
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, // Valor por defecto
      allowNull: false // Obligatorio: el estado de actividad debe estar definido
    }
  }, {
    timestamps: false
  });
};
