const server = require("./src/server");
const { sequelize } = require("./src/config/db");
const PORT = process.env.PORT || 3001;

server.listen(PORT, async () => {
	try {
		await sequelize.sync({ force: true});
		console.log(`Server listening on port http://localhost:${PORT}`);
	} catch (error) {
		console.error(error);
	}
});
