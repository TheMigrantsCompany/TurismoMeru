const checkAdminRole = (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "Usuario no autenticado",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Acceso denegado. Se requieren privilegios de administrador.",
      });
    }

    next();
  } catch (error) {
    console.error("Error en checkAdminRole:", error);
    res.status(500).json({
      message: "Error interno del servidor al verificar rol",
      error: error.message,
    });
  }
};

module.exports = checkAdminRole;
