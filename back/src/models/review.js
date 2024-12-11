const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Review', {
    id_Review: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false // Obligatorio: siempre debe existir un ID
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false // Obligatorio: el contenido de la reseña es necesario
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false, // Obligatorio: la calificación es necesaria
      validate: {
        min: 1, // Mínimo valor permitido
        max: 5  // Máximo valor permitido
      }
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
    serviceTitle:{    
      type: DataTypes.STRING,
      allowNull: true  //El título del servicio se asigna luego
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, // Opcional: por defecto es verdadero, pero puede no ser necesario especificarlo
      allowNull: false // Obligatorio: el estado debe estar definido
    }
  }, {
    timestamps: true
  });
};
