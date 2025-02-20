import React from "react";
import { Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";

const AboutUs = () => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center mb-12"
        >
          <Typography variant="h2" className="text-[#d98248] mb-4 font-poppins ">
            Sobre Nosotros
          </Typography>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-[#dac9aa]/20 py-4 px-6 rounded-xl inline-block"
          >
            <Typography className="text-[#4256a6] text-xl md:text-2xl font-medium font-poppins italic">
              "Descubre la magia del Fin del Mundo con nosotros"
            </Typography>
          </motion.div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Misión */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[#f9f3e1] p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-[#dac9aa]/20 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#4256a6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <Typography variant="h5" className="text-[#d98248] text-center mb-3 font-poppins">
              Nuestra Misión
            </Typography>
            <Typography className="text-[#425a66] text-center">
              Crear experiencias únicas y memorables en Ushuaia, conectando a los viajeros con la naturaleza y la cultura local de manera sostenible.
            </Typography>
          </motion.div>

          {/* Visión */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-[#f9f3e1] p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-[#dac9aa]/20 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#4256a6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
            </div>
            <Typography variant="h5" className="text-[#d98248] text-center mb-3 font-poppins">
              Nuestra Visión
            </Typography>
            <Typography className="text-[#425a66] text-center">
              Ser la referencia en turismo aventura en Tierra del Fuego, ofreciendo las mejores excursiones y experiencias para nuestros visitantes.
            </Typography>
          </motion.div>

          {/* Valores */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-[#f9f3e1] p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-[#dac9aa]/20 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#4256a6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>
            <Typography variant="h5" className="text-[#d98248] text-center mb-3 font-poppins">
              Nuestros Valores
            </Typography>
            <Typography className="text-[#425a66] text-center">
              Compromiso con la excelencia, respeto por la naturaleza y pasión por brindar experiencias auténticas y seguras.
            </Typography>
          </motion.div>
        </div>

        {/* Información adicional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 bg-[#f9f3e1] p-8 rounded-xl shadow-lg max-w-3xl mx-auto"
        >
          <Typography className="text-[#425a66] text-center leading-relaxed">
            En TurismoMeru, nos dedicamos a hacer realidad tus sueños de aventura en el Fin del Mundo. 
            Con años de experiencia y un equipo apasionado, te garantizamos experiencias únicas y seguras 
            en los paisajes más impresionantes de Ushuaia y Tierra del Fuego.
          </Typography>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs;
