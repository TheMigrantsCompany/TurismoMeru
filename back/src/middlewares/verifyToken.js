// middlewares/verifyToken.js
const { auth } = require("../config/firebaseAdmin");
const { User } = require("../config/db");

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Token no proporcionado correctamente" });
    }

    try {
      const token = authHeader.split(" ")[1];
      const decodedToken = await auth.verifyIdToken(token);

      if (!decodedToken || !decodedToken.email) {
        return res.status(401).json({ message: "Token inválido o sin email" });
      }

      // Verificar que la conexión a la base de datos esté activa
      try {
        await User.sequelize.authenticate();
      } catch (dbError) {
        console.error("Error de conexión a la base de datos:", dbError);
        return res
          .status(500)
          .json({ message: "Error de conexión a la base de datos" });
      }

      // Buscar usuario en la base de datos
      let user = null;
      try {
        user = await User.findOne({
          where: {
            email: decodedToken.email,
          },
        });
      } catch (findError) {
        console.error("Error al buscar usuario:", findError);
        return res
          .status(500)
          .json({ message: "Error al buscar usuario en la base de datos" });
      }

      // Si el usuario no existe en la base de datos, lo creamos
      if (!user) {
        const adminEmails = [
          "franciscomeruviajes@gmail.com",
          "lautiu9@gmail.com",
          "agusramos12@gmail.com",
          "iaba.sur@gmail.com",
        ];

        try {
          user = await User.create({
            email: decodedToken.email,
            name: decodedToken.name || "",
            image: decodedToken.picture || "",
            role: adminEmails.includes(decodedToken.email)
              ? "admin"
              : "customer",
            active: true,
          });
        } catch (createError) {
          console.error("Error al crear usuario:", createError);
          return res
            .status(500)
            .json({ message: "Error al crear usuario en la base de datos" });
        }
      }

      // Agregar información del usuario al request
      req.user = {
        email: decodedToken.email,
        role: user.role,
        uid: decodedToken.uid,
      };

      next();
    } catch (tokenError) {
      console.error("Error al verificar token:", tokenError);
      return res
        .status(401)
        .json({ message: "Token inválido", error: tokenError.message });
    }
  } catch (error) {
    console.error("Error general en verifyToken:", error);
    return res.status(500).json({
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

module.exports = verifyToken;
