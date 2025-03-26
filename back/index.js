require("dotenv").config();
const server = require("./src/server");
const { sequelize } = require("./src/config/db");

const PORT = process.env.PORT || 3001; // Usar el puerto que asigna Render en producción

server.listen(PORT, async () => {
  try {
    await sequelize.sync({ force: false });
   // console.log(`Server listening on port ${PORT}`);
  } catch (error) {
    console.error(error);
  }
});
