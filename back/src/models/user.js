const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('User', {
    id_User: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false // Obligatorio: siempre debe existir un ID
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false // Obligatorio: el nombre del usuario es necesario
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false // Obligatorio: el correo electrónico es necesario y debe ser único
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true, // Obligatorio: la contraseña es necesaria
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false, // Obligatorio: debe haber un rol definido
      defaultValue: 'customer' // Valor por defecto
    },
    DNI: {
      type: DataTypes.STRING,
      allowNull: true // Opcional: el DNI puede no ser obligatorio
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true // Opcional: el número de teléfono puede no ser obligatorio
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true // Opcional: la imagen puede no ser necesaria
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true // Opcional: la dirección puede no ser necesaria
    },
    shoppingCart: {
      type: DataTypes.JSON,
      allowNull: true // Opcional: el carrito de compras puede no ser necesario
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, // Valor por defecto
      allowNull: false // Obligatorio: el estado de actividad debe estar definido
    }
  }, {
    timestamps: true
  });
};
