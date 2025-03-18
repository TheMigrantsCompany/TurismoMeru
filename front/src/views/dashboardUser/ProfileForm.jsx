import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { getUserDetails, updateUserDetails } from "../../redux/actions/actions";
import { motion } from "framer-motion";

const ProfileForm = () => {
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.users);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    DNI: "",
    phone: "",
    address: "",
    image: "",
    birthDate: "",
    gender: "",
    nationality: "",
    emergencyContact: {
      name: "",
      phone: "",
    },
    medicalInfo: "",
    experienceLevel: "",
    interests: [],
  });

  useEffect(() => {
    if (userDetails) {
      setProfile(userDetails);
    }
  }, [userDetails]);

  const handleSave = () => {
    const uuid = localStorage.getItem("uuid");
    if (!profile.name || !profile.email) {
      Swal.fire(
        "Error",
        "Por favor completa los campos obligatorios.",
        "error"
      );
      return;
    }

    // Se arma el objeto a enviar al backend con todos los campos
    const backendProfile = {
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      image: profile.image,
      address: profile.address,
      DNI: profile.DNI,
      birthDate: profile.birthDate,
      gender: profile.gender,
      nationality: profile.nationality,
      emergencyContact: profile.emergencyContact,
      medicalInfo: profile.medicalInfo,
      experienceLevel: profile.experienceLevel,
      interests: profile.interests,
      active: true,
    };

    if (uuid) {
      dispatch(updateUserDetails(uuid, backendProfile))
        .then(() => {
          Swal.fire(
            "Perfil actualizado",
            "Los datos han sido guardados.",
            "success"
          );
        })
        .catch((error) => {
          console.error("Error al actualizar el perfil:", error);
          Swal.fire("Error", "Ocurrió un error al guardar los datos.", "error");
        });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setProfile((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setProfile((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "meruvyt");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dzrnybyqo/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      if (data.secure_url) {
        setProfile((prev) => ({
          ...prev,
          image: data.secure_url,
        }));
        Swal.fire(
          "Imagen subida",
          "La imagen se ha cargado correctamente.",
          "success"
        );
      } else {
        Swal.fire("Error", "Error al subir la imagen a Cloudinary.", "error");
      }
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      Swal.fire(
        "Error",
        "No se pudo subir la imagen. Inténtalo de nuevo.",
        "error"
      );
    }
  };

  const experienceLevels = [
    { value: "principiante", label: "Principiante" },
    { value: "intermedio", label: "Intermedio" },
    { value: "avanzado", label: "Avanzado" },
  ];

  const interestOptions = [
    "Montañismo",
    "Trekking",
    "Camping",
    "Fotografía",
    "Observación de aves",
    "Escalada",
  ];

  const handleInterestChange = (interest) => {
    setProfile((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  return (
    <div className="min-h-screen bg-[#dac9aa] py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-[#f9f3e1] rounded-2xl shadow-lg overflow-hidden">
            <div className="p-8 border-b border-[#425a66]/10">
              <h2 className="text-3xl font-bold text-[#4256a6] font-poppins">
                Mi Perfil
              </h2>
              <p className="mt-2 text-[#425a66]">
                Gestiona tu información personal
              </p>
            </div>

            <div className="p-8">
              <div className="flex flex-col md:flex-row items-start gap-8 mb-8">
                <div className="relative group w-40 h-40 rounded-2xl overflow-hidden shadow-md mx-auto md:mx-0">
                  <img
                    src={profile.image}
                    alt="Perfil"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="cursor-pointer text-white text-sm font-medium bg-[#4256a6]/80 px-4 py-2 rounded-lg hover:bg-[#4256a6] transition-colors">
                      Cambiar foto
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoUpload}
                      />
                    </label>
                  </div>
                </div>

                <div className="flex-1 w-full space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#425a66] mb-2">
                        Nombre completo
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-[#425a66]/20 focus:ring-2 focus:ring-[#4256a6] focus:border-transparent transition-all bg-white text-black"
                        placeholder="Tu nombre completo"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#425a66] mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-[#425a66]/20 bg-[#f9f3e1]/5 text-black"
                        placeholder="Tu email"
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#425a66] mb-2">
                        DNI
                      </label>
                      <input
                        type="text"
                        name="DNI"
                        value={profile.DNI}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-[#425a66]/20 focus:ring-2 focus:ring-[#4256a6] focus:border-transparent transition-all bg-white text-black"
                        placeholder="Tu DNI"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#425a66] mb-2">
                        Teléfono
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={profile.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-[#425a66]/20 focus:ring-2 focus:ring-[#4256a6] focus:border-transparent transition-all bg-white text-black"
                        placeholder="Tu número de teléfono"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-[#425a66] mb-2">
                        Dirección
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={profile.address}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-[#425a66]/20 focus:ring-2 focus:ring-[#4256a6] focus:border-transparent transition-all bg-white text-black"
                        placeholder="Tu dirección"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#425a66] mb-2">
                        Fecha de nacimiento
                      </label>
                      <input
                        type="date"
                        name="birthDate"
                        value={profile.birthDate}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-[#425a66]/20 focus:ring-2 focus:ring-[#4256a6] focus:border-transparent transition-all bg-white text-black"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#425a66] mb-2">
                        Género
                      </label>
                      <select
                        name="gender"
                        value={profile.gender}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-[#425a66]/20 focus:ring-2 focus:ring-[#4256a6] focus:border-transparent transition-all bg-white text-black"
                      >
                        <option value="">Seleccionar...</option>
                        <option value="masculino">Masculino</option>
                        <option value="femenino">Femenino</option>
                        <option value="otro">Otro</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#425a66] mb-2">
                        Nacionalidad
                      </label>
                      <input
                        type="text"
                        name="nationality"
                        value={profile.nationality}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-[#425a66]/20 focus:ring-2 focus:ring-[#4256a6] focus:border-transparent transition-all bg-white text-black"
                        placeholder="Tu nacionalidad"
                      />
                    </div>
                  </div>

                  <div className="md:grid md:grid-cols-2 gap-4">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-[#425a66] mb-2">
                        Nivel de experiencia
                      </label>
                      <select
                        name="experienceLevel"
                        value={profile.experienceLevel}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-[#425a66]/20 focus:ring-2 focus:ring-[#4256a6] focus:border-transparent transition-all bg-white text-black"
                      >
                        <option value="">Seleccionar...</option>
                        {experienceLevels.map((level) => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-[#425a66] mb-2">
                        Intereses
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {interestOptions.map((interest) => (
                          <button
                            key={interest}
                            type="button"
                            onClick={() => handleInterestChange(interest)}
                            className={`px-4 py-2 rounded-lg ${
                              profile.interests.includes(interest)
                                ? "bg-[#4256a6] text-white"
                                : "bg-[#f9f3e1] text-[#4256a6]"
                            }`}
                          >
                            {interest}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="bg-[#4256a6] text-white py-3 px-6 rounded-xl"
                      onClick={handleSave}
                    >
                      Guardar cambios
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
