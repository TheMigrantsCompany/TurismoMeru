const syncUsersController = require('../../controllers/user/syncUsersController');

const syncUsersHandler = async (req, res) => {
  try {
    const result = await syncUsersController();
    res.status(200).json({ message: 'Sincronización exitosa', result });
  } catch (error) {
    res.status(500).json({ message: 'Error al sincronizar con Firebase', error });
  }
};

module.exports = syncUsersHandler;
