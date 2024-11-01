// middlewares/verifyToken.js
const { auth } = require('../config/firebaseAdmin');

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Espera el token en formato "Bearer <token>"
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Verifica el token con Firebase Admin
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken; // Añade la información del usuario a req.user para su uso en el controlador
    next(); // Continúa al siguiente middleware o controlador
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized', error: error.message });
  }
};

module.exports = verifyToken;
