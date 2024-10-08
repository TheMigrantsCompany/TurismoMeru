import React, { useState } from 'react';

const ProfileForm = () => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    province: '',
    phoneNumber: '',
    photo: 'https://via.placeholder.com/150' // URL predeterminada para la imagen de perfil
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setProfile((prevProfile) => ({
        ...prevProfile,
        photo: reader.result
      }));
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-xl mx-auto text-gray-700  p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Perfil</h2>
 

      <div className="flex items-center mb-6">
        <label className="block text-gray-700 font-bold mr-4">Foto</label>
        <div className="relative">
          <img
            src={profile.photo}
            alt="Perfil"
            className="w-24 h-24 rounded-full object-cover"
          />
          <input
            type="file"
            accept="image/*"
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handlePhotoUpload}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 font-bold">Nombre</label>
          <input
            type="text"
            name="firstName"
            value={profile.firstName}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-bold">Apellido</label>
          <input
            type="text"
            name="lastName"
            value={profile.lastName}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-lg"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold">Email</label>
        <input
          type="email"
          name="email"
          value={profile.email}
          onChange={handleChange}
          className="mt-1 p-2 w-full border rounded-lg"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold">Direccion</label>
        <input
          type="text"
          name="address"
          value={profile.address}
          onChange={handleChange}
          className="mt-1 p-2 w-full border rounded-lg"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold">Provincia</label>
        <input
          type="text"
          name="province"
          value={profile.province}
          onChange={handleChange}
          className="mt-1 p-2 w-full border rounded-lg"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold">Telefono</label>
        <input
          type="text"
          name="phoneNumber"
          value={profile.phoneNumber}
          onChange={handleChange}
          className="mt-1 p-2 w-full border rounded-lg"
        />
      </div>

      <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
       Guardar Cambios
      </button>
    </div>
  );
};

export default ProfileForm;