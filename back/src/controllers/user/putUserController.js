const { User } = require("../../config/db");

const putUserController = async (id, updatedData) => {
  try {
    const user = await User.findByPk(id);
    if (!user) return null;

    // Validar y procesar los datos antes de actualizar
    if (updatedData.birthDate) {
      updatedData.birthDate = new Date(updatedData.birthDate);
    }

    if (updatedData.interests && !Array.isArray(updatedData.interests)) {
      updatedData.interests = [];
    }

    if (
      updatedData.emergencyContact &&
      typeof updatedData.emergencyContact === "string"
    ) {
      try {
        updatedData.emergencyContact = JSON.parse(updatedData.emergencyContact);
      } catch (e) {
        updatedData.emergencyContact = { name: "", phone: "" };
      }
    }

    await user.update(updatedData);
    return user;
  } catch (error) {
    console.error("Error en putUserController:", error);
    throw error;
  }
};

module.exports = putUserController;
