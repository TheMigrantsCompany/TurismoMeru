require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { NODE_ENV } = process.env;

let dbConfig = {
  environment: NODE_ENV,
};

// Extraer información de DATABASE_URL si está disponible
if (process.env.DATABASE_URL) {
  try {
    const url = new URL(process.env.DATABASE_URL);
    dbConfig = {
      user: url.username,
      host: url.hostname,
      database: url.pathname.split("/")[1],
      environment: NODE_ENV,
    };
  } catch (error) {
    console.error("Error al parsear DATABASE_URL:", error.message);
  }
}

console.log("Configuración DB:", dbConfig);

// Configuración de dialectOptions según el entorno
const dialectOptions =
  NODE_ENV === "production"
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {};

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  logging: false,
  native: false,
  dialectOptions: dialectOptions,
});

// Verificar la conexión usando IIFE
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión a la base de datos establecida correctamente.");
  } catch (error) {
    console.error("No se pudo conectar a la base de datos:", error);
  }
})();

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
User.hasMany(Booking, { foreignKey: "id_User", as: "bookings" });
Booking.belongsTo(User, { foreignKey: "id_User", as: "user" });

// Un servicio puede ser reservado muchas veces
Service.hasMany(Booking, { foreignKey: "id_Service", as: "bookings" });
Booking.belongsTo(Service, { foreignKey: "id_Service", as: "service" });

// Una orden de servicio puede tener muchas reservas
ServiceOrder.hasMany(Booking, {
  foreignKey: "id_ServiceOrder",
  as: "bookings",
});
Booking.belongsTo(ServiceOrder, {
  foreignKey: "id_ServiceOrder",
  as: "serviceOrder",
});

// Relaciones Muchos a Uno
Service.hasMany(Review, { foreignKey: "id_Service", as: "reviews" });
Review.belongsTo(Service, { foreignKey: "id_Service", as: "services" });

User.hasMany(Review, { foreignKey: "id_User", as: "reviews" });
Review.belongsTo(User, { foreignKey: "id_User", as: "user" });

module.exports = {
  ...sequelize.models, // Exportamos todos los modelos
  sequelize, // Exportamos la conexión para sincronizar los modelos y la DB
};
