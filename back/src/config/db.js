require("dotenv").config();
const { Sequelize } = require("sequelize");

const fs = require("fs");
const path = require("path");
const { DB_USER, DB_PASSWORD, DB_HOST } = process.env;

const sequelize = new Sequelize(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/turismomeru`,
  {
    logging: false,
    native: false,
  }
);

const basename = path.basename(__filename);

const modelDefiners = [];

// Leer todos los archivos de modelos y agregarlos al array de modelDefiners
fs.readdirSync(path.join(__dirname, "..", "models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "..", "models", file)));
  });

modelDefiners.forEach((model) => model(sequelize));

// Capitalizar los nombres de los modelos para usarlos como propiedades de sequelize.models
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

// Define los modelos de la base de datos
const { User, Service, ServiceOrder, Booking, Review } = sequelize.models;

// Definir las relaciones entre modelos:

// Un usuario puede realizar muchas órdenes de servicio
ServiceOrder.belongsTo(User, { foreignKey: "id_User" });
User.hasMany(ServiceOrder, { foreignKey: "id_User" });

// Relaciones Muchos a Muchos entre ServiceOrder y Service
ServiceOrder.belongsToMany(Service, {
  through: "ServiceOrderService",
  foreignKey: "id_ServiceOrder",
  otherKey: "id_Service",
  as: "services",
});
Service.belongsToMany(ServiceOrder, {
  through: "ServiceOrderService",
  foreignKey: "id_Service",
  otherKey: "id_ServiceOrder",
  as: "serviceOrders",
});
// Un usuario puede hacer muchas reservas
User.hasMany(Booking);
Booking.belongsTo(User);

// Un servicio puede ser reservado muchas veces
Service.hasMany(Booking);
Booking.belongsTo(Service);

// Una orden de servicio puede tener muchas reservas
ServiceOrder.hasMany(Booking);
Booking.belongsTo(ServiceOrder);

// Un usuario puede dejar muchas reseñas
User.hasMany(Review);
Review.belongsTo(User);

// Un servicio puede recibir muchas reseñas
Service.hasMany(Review);
Review.belongsTo(Service);

module.exports = {
  ...sequelize.models, // Exportamos todos los modelos
  sequelize, // Exportamos la conexión para sincronizar los modelos y la DB
};
