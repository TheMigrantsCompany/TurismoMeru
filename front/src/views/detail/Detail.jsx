import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography } from "@material-tailwind/react";
import BookingCard from "../../components/bookingcard/BookingCard";

export function Detail() {
  const { id_Service } = useParams();
  const [excursion, setExcursion] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:3001/service/id/${id_Service}`)
      .then((response) => response.json())
      .then((data) => setExcursion(data))
      .catch((error) =>
        console.error("Error fetching excursion details:", error)
      );
  }, [id_Service]);

  if (!excursion) return <p className="text-center text-gray-500">Cargando...</p>;

  const photos = excursion.photos || [];

  return (
    <section className="py-12 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        {/* Título */}
        <Typography className="mb-8 text-3xl lg:text-4xl font-bold text-gray-800 text-center">
          {excursion.title}
        </Typography>

        {/* Contenedor principal */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Imagen y detalles */}
          <div className="lg:w-2/3">
            {/* Contenedor de imagen */}
            <div className="relative max-w-full mx-auto mb-6">
              {photos.length > 0 ? (
                <img
                  src={photos[currentPhotoIndex]}
                  alt={`Excursion photo ${currentPhotoIndex + 1}`}
                  className="w-full h-72 object-cover rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300"
                  onError={(e) => (e.target.src = "default_image_url.png")}
                />
              ) : (
                <img
                  src="default_image_url.png"
                  alt="Default"
                  className="w-full h-72 object-cover rounded-lg shadow-lg"
                />
              )}
              {photos.length > 1 && (
                <div className="flex justify-between absolute inset-0 items-center px-4">
                  <button
                    onClick={() =>
                      setCurrentPhotoIndex((prev) =>
                        prev === 0 ? photos.length - 1 : prev - 1
                      )
                    }
                    className="bg-gray-700 text-white bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 focus:outline-none"
                  >
                    ❮
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPhotoIndex((prev) =>
                        prev === photos.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="bg-gray-700 text-white bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 focus:outline-none"
                  >
                    ❯
                  </button>
                </div>
              )}
            </div>

            {/* Descripción */}
            <Typography
              variant="body1"
              className="text-justify text-gray-700 mb-6 leading-relaxed"
            >
              {excursion.description}
            </Typography>

            {/* Información adicional */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {excursion.location && (
                <Typography className="text-gray-700">
                  <strong className="font-semibold text-gray-800">Ubicación:</strong>{" "}
                  {excursion.location}
                </Typography>
              )}
              {excursion.duration && (
                <Typography className="text-gray-700">
                  <strong className="font-semibold text-gray-800">Duración:</strong>{" "}
                  {excursion.duration} horas
                </Typography>
              )}
              {excursion.difficulty && (
                <Typography className="text-gray-700">
                  <strong className="font-semibold text-gray-800">Dificultad:</strong>{" "}
                  {excursion.difficulty}
                </Typography>
              )}
            </div>

            {/* Guías */}
            {Array.isArray(excursion.guides) && excursion.guides.length > 0 && (
              <div className="mt-6">
                <Typography
                  variant="h6"
                  className="text-lg font-semibold text-gray-800 mb-2"
                >
                  Guías:
                </Typography>
                <ul className="list-disc pl-6 text-gray-700">
                  {excursion.guides.map((guide, index) => (
                    <li key={index}>
                      {guide.name} - {guide.language}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Tarjeta de reserva */}
          <div className="lg:w-1/3">
            <div className="bg-white p-6 rounded-lg shadow-lg sticky top-24">
              <BookingCard id_Service={id_Service} price={excursion.price} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Detail;
