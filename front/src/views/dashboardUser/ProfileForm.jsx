import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { getUserDetails, updateUserDetails } from "../../redux/actions/actions";

const ProfileForm = () => {
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.users);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    DNI: "",
    phone: "",
    address: "",
    image: "https://via.placeholder.com/150", 
  });

  useEffect(() => {
    const uuid = localStorage.getItem("uuid");
    if (uuid) {
      dispatch(getUserDetails(uuid)); 
    }
  }, [dispatch]);

  useEffect(() => {
    if (userDetails) {
      setProfile({
        name: userDetails.name || "",
        email: userDetails.email || "",
        DNI: userDetails.DNI || "",
        phone: userDetails.phone || "",
        address: userDetails.address || "",
        image: userDetails.image || "https://via.placeholder.com/150", 
      });
    }
  }, [userDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
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
        Swal.fire("Imagen subida", "La imagen se ha cargado correctamente.", "success");
      } else {
        Swal.fire("Error", "Error al subir la imagen a Cloudinary.", "error");
      }
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      Swal.fire("Error", "No se pudo subir la imagen. Inténtalo de nuevo.", "error");
    }
  };

  const handleSave = () => {
    const uuid = localStorage.getItem("uuid");
    if (!profile.name || !profile.email || !profile.address) {
      Swal.fire("Error", "Por favor completa los campos obligatorios.", "error");
      return;
    }

    if (uuid) {
      dispatch(updateUserDetails(uuid, profile)) 
        .then(() => {
          Swal.fire("Perfil actualizado", "Los datos han sido guardados.", "success");
        })
        .catch(() => {
          Swal.fire("Error", "Ocurrió un error al guardar los datos.", "error");
        });
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-[#f9f3e1] border-l-4 border-[#425a66] p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-[#4256a6] font-poppins">Perfil</h2>

      <div className="flex items-center mb-6">
        <label className="block text-[#4256a6] font-bold mr-4">Foto</label>
        <div className="relative">
          <img
            src={profile.image}
            alt="Perfil"
            className="w-24 h-24 rounded-full object-cover border border-[#425a66]"
          />
          <input
            type="file"
            accept="image/*"
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handlePhotoUpload}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-4">
        <div>
          <label className="block text-[#4256a6] font-bold">Nombre completo</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            className="w-full p-2 border border-[#425a66] rounded bg-white text-[#425a66] placeholder-gray-500"
            placeholder="Nombre completo"
          />
        </div>
        <div>
          <label className="block text-[#4256a6] font-bold">Email</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            className="w-full p-2 border border-[#425a66] rounded bg-white text-[#425a66] placeholder-gray-500"
            placeholder="Email"
            readOnly
          />
        </div>
        <div>
          <label className="block text-[#425a6] font-bold">DNI</label>
          <input
            type="text"
            name="DNI"
            value={profile.DNI}
            onChange={handleChange}
            className="w-full p-2 border border-[#425a66] rounded bg-white text-[#425a66] placeholder-gray-500"
            placeholder="DNI"
          />
        </div>
        <div>
          <label className="block text-[#425a6] font-bold">Teléfono</label>
          <input
            type="text"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            className="w-full p-2 border border-[#425a66] rounded bg-white text-[#425a66] placeholder-gray-500"
            placeholder="Teléfono"
          />
        </div>
        <div>
          <label className="block text-[#425a6] font-bold">Dirección</label>
          <input
            type="text"
            name="address"
            value={profile.address}
            onChange={handleChange}
            className="w-full p-2 border border-[#425a66] rounded bg-white text-[#425a66] placeholder-gray-500"
            placeholder="Dirección"
          />
        </div>
      </div>

      <button
        className="w-full bg-[#4256a6] text-white py-2 px-4 rounded-lg hover:bg-[#334477] transition-all"
        onClick={handleSave}
      >
        Guardar Cambios
      </button>
    </div>
  );
};

export default ProfileForm;
