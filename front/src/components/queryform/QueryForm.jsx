import React, { useState } from "react";
import { Typography, Button } from "@material-tailwind/react";
import { motion } from "framer-motion";
import emailjs from "emailjs-com";

const QueryForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState({
    type: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setStatus({ type: "loading", message: "Enviando consulta..." });

      await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
        },
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      );

      setStatus({
        type: "success",
        message: "¡Gracias por tu consulta! Te responderemos a la brevedad.",
      });
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      setStatus({
        type: "error",
        message: "Hubo un error al enviar tu consulta. Por favor, intenta nuevamente.",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#f9f3e1] rounded-xl shadow-lg p-6 max-w-4xl mx-auto"
    >
      <div className="text-center mb-6">
        <Typography variant="h3" className="text-[#d98248] mb-2 font-poppins">
          ¿Tienes alguna consulta?
        </Typography>
        <Typography className="text-[#425a66]">
          Estamos aquí para ayudarte a planificar tu próxima aventura
        </Typography>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#4256a6] mb-1" htmlFor="name">
              Nombre completo
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-[#425a66]/20 focus:ring-2 focus:ring-[#4256a6] focus:border-transparent transition-all bg-white text-[#425a66]"
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4256a6] mb-1" htmlFor="email">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-[#425a66]/20 focus:ring-2 focus:ring-[#4256a6] focus:border-transparent transition-all bg-white text-[#425a66]"
              placeholder="tu@email.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#4256a6] mb-1" htmlFor="message">
            Tu consulta
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="3"
            className="w-full px-4 py-2 rounded-lg border border-[#425a66]/20 focus:ring-2 focus:ring-[#4256a6] focus:border-transparent transition-all bg-white text-[#425a66] resize-none"
            placeholder="¿En qué podemos ayudarte?"
          />
        </div>

        {status.message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-lg ${
              status.type === "success"
                ? "bg-green-100 text-green-700"
                : status.type === "error"
                ? "bg-red-100 text-red-700"
                : "bg-[#dac9aa]/20 text-[#4256a6]"
            }`}
          >
            {status.message}
          </motion.div>
        )}

        <div className="flex justify-center">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="submit"
              disabled={status.type === "loading"}
              className="bg-[#4256a6] text-white px-12 py-2 rounded-lg hover:bg-[#2a3875] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status.type === "loading" ? "Enviando..." : "Enviar consulta"}
            </Button>
          </motion.div>
        </div>
      </form>
    </motion.div>
  );
};

export default QueryForm;
