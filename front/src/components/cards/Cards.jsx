import { Link } from "react-router-dom";
import { Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";

export default function Card({ excursion }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden bg-[#f9f3e1] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
    >
      {/* Imagen con superposición */}
      <div className="relative h-64">
        <img
          className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
          src={excursion.photos[0]}
          alt={excursion.title}
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1469474968028-56623f02e42e";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <Typography variant="h5" className="text-white font-semibold line-clamp-1">
            {excursion.title}
          </Typography>
          {excursion.location && (
            <div className="flex items-center space-x-1 text-white/90 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <Typography className="text-sm">
                {excursion.location}
              </Typography>
            </div>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6">
        <div className="space-y-4">
          {/* Detalles de la excursión */}
          <div className="grid grid-cols-2 gap-3">
            {excursion.duration && (
              <div className="bg-[#dac9aa]/20 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#4256a6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <Typography className="text-sm font-medium text-[#4256a6]">
                    {excursion.duration}h
                  </Typography>
                </div>
              </div>
            )}
            
            {excursion.difficulty && (
              <div className="bg-[#dac9aa]/20 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#4256a6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <Typography className="text-sm font-medium text-[#4256a6]">
                    {excursion.difficulty}
                  </Typography>
                </div>
              </div>
            )}
          </div>

          {/* Precio */}
          {excursion.price && (
            <div className="pt-4 border-t border-[#425a66]/10">
              <div className="flex flex-col items-end">
                <Typography className="text-[#425a66] text-sm">
                  Precio por persona
                </Typography>
                <Typography className="text-2xl font-bold text-[#4256a6]">
                  {formatCurrency(excursion.price)}
                </Typography>
              </div>
            </div>
          )}

          {/* Botón de acción */}
          <Link
            to={`/detail/${excursion.id_Service}`}
            className="block w-full text-center bg-[#4256a6] text-white py-3 rounded-lg hover:bg-[#2a3875] transition-colors duration-300 mt-4"
          >
            Ver detalles
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
