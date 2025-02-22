process.env.NODE_ENV = process.env.NODE_ENV || "production";
require("dotenv").config();
const server = require("./src/server");
const { sequelize } = require("./src/config/db");
const PORT = process.env.PORT || 3001;

server.listen(PORT, async () => {
  try {
    await sequelize.sync({ force: false });
    console.log(`Server listening on port ${PORT}`);
  } catch (error) {
    console.error(error);
  }
});
