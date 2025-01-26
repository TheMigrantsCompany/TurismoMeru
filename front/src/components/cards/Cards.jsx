import { Link } from "react-router-dom";

export default function Card({ excursion }) {
  return (
    <div className="max-w-sm overflow-hidden bg-white bg-opacity-90 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl dark:bg-gray-800 dark:bg-opacity-80">
      {/* Imagen con superposición */}
      <div className="relative">
        <img
          className="object-cover w-full h-64 rounded-t-lg transition-transform duration-300 hover:scale-110"
          src={excursion.photos[0]}
          alt={excursion.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60 rounded-t-lg"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <h2 className="text-lg font-bold">{excursion.title}</h2>
          {excursion.location && (
            <p className="text-sm text-gray-200">{excursion.location}</p>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[#4256a6] uppercase dark:text-blue-400">
            Excursión
          </span>
          {excursion.difficulty && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              
            </span>
          )}
        </div>

        {/* Precio */}
        {excursion.price && (
          <div className="mt-4 flex justify-center items-center">
            <span className="text-2xl font-bold text-gray-800 dark:text-white">
              ${excursion.price}
            </span>
          </div>
        )}

        {/* Enlace de texto */}
        <div className="mt-6 flex justify-center">
          <Link
            to={`/detail/${excursion.id_Service}`}
            className="text-sm font-medium text-[#4256a6] hover:underline"
          >
            Contratar
          </Link>
        </div>
      </div>
    </div>
  );
}
