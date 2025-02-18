import React from "react";
import { Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";

const UserModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000cc]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[#f9f3e1] p-8 rounded-xl max-w-lg w-full relative z-10 overflow-y-auto max-h-[90vh] shadow-xl"
      >
        <Typography variant="h4" className="text-[#4256a6] mb-6">
          Detalles del Usuario
        </Typography>

        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <Typography variant="h6" className="text-[#4256a6] mb-2">
              Información Personal
            </Typography>
            <div className="flex items-center gap-4 mb-4">
              <img
                src={user.image || "https://via.placeholder.com/100"}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-[#4256a6]"
              />
              <div>
                <Typography className="text-[#425a66] font-medium">
                  {user.name}
                </Typography>
                <Typography className="text-[#425a66]">{user.email}</Typography>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[#425a66]">
                <span className="font-medium">DNI:</span> {user.DNI}
              </p>
              <p className="text-[#425a66]">
                <span className="font-medium">Teléfono:</span> {user.phone}
              </p>
              <p className="text-[#425a66]">
                <span className="font-medium">Dirección:</span> {user.address}
              </p>
              <p className="text-[#425a66]">
                <span className="font-medium">Fecha de Nacimiento:</span>{" "}
                {user.birthDate}
              </p>
              <p className="text-[#425a66]">
                <span className="font-medium">Género:</span> {user.gender}
              </p>
              <p className="text-[#425a66]">
                <span className="font-medium">Nacionalidad:</span>{" "}
                {user.nationality}
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <Typography variant="h6" className="text-[#4256a6] mb-2">
              Información de Emergencia
            </Typography>
            <div className="space-y-2">
              <p className="text-[#425a66]">
                <span className="font-medium">Contacto de Emergencia:</span>{" "}
                {user.emergencyContact?.name}
              </p>
              <p className="text-[#425a66]">
                <span className="font-medium">Teléfono de Emergencia:</span>{" "}
                {user.emergencyContact?.phone}
              </p>
              <p className="text-[#425a66]">
                <span className="font-medium">Información Médica:</span>{" "}
                {user.medicalInfo}
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <Typography variant="h6" className="text-[#4256a6] mb-2">
              Preferencias de Excursiones
            </Typography>
            <div className="space-y-2">
              <p className="text-[#425a66]">
                <span className="font-medium">Nivel de Experiencia:</span>{" "}
                {user.experienceLevel}
              </p>
              <div>
                <span className="font-medium text-[#425a66]">Intereses:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {user.interests?.map((interest, index) => (
                    <span
                      key={index}
                      className="bg-[#4256a6] text-white px-2 py-1 rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <Typography variant="h6" className="text-[#4256a6] mb-2">
              Detalles de la Cuenta
            </Typography>
            <div className="space-y-2">
              <p className="text-[#425a66]">
                <span className="font-medium">Rol:</span> {user.role}
              </p>
              <p className="text-[#425a66]">
                <span className="font-medium">Estado:</span>{" "}
                <span
                  className={user.active ? "text-green-600" : "text-red-600"}
                >
                  {user.active ? "Activo" : "Inactivo"}
                </span>
              </p>
              <p className="text-[#425a66]">
                <span className="font-medium">Fecha de registro:</span>{" "}
                {new Date(user.createdAt).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="px-6 py-2 bg-[#f4925b] text-white rounded-lg hover:bg-[#d98248] transition-colors"
          >
            Cerrar
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default UserModal;
