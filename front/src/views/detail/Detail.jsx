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

  if (!excursion) return <p>Loading...</p>;

  const photos = excursion.photos || [];

  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prevIndex) =>
      prevIndex === photos.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePreviousPhoto = () => {
    setCurrentPhotoIndex((prevIndex) =>
      prevIndex === 0 ? photos.length - 1 : prevIndex - 1
    );
  };

  return (
    <section className="py-16 px-8 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        {/* Título separado arriba */}
        <Typography
          variant="h3"
          className="font-semibold text-gray-800 text-center mb-10"
        >
          {excursion.title}
        </Typography>

        {/* Contenedor principal */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Imagen y texto alineados */}
          <div className="lg:col-span-2 flex flex-wrap lg:flex-nowrap gap-6 items-start">
            {/* Imagen / Carrusel */}
            <div className="relative max-w-sm">
              {photos.length > 0 ? (
                <div className="relative">
                  <img
                    src={photos[currentPhotoIndex]}
                    alt={`Excursion photo ${currentPhotoIndex + 1}`}
                    className="w-full h-auto rounded-lg shadow-md"
                    onError={(e) => (e.target.src = "default_image_url.png")}
                  />
                  {photos.length > 1 && (
                    <div className="absolute inset-0 flex justify-between items-center">
                      <button
                        onClick={handlePreviousPhoto}
                        className="bg-gray-700 text-white bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 focus:outline-none absolute left-2 top-1/2 transform -translate-y-1/2"
                      >
                        ❮
                      </button>
                      <button
                        onClick={handleNextPhoto}
                        className="bg-gray-700 text-white bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 focus:outline-none absolute right-2 top-1/2 transform -translate-y-1/2"
                      >
                        ❯
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <img
                  src="default_image_url.png"
                  alt="Default"
                  className="w-full h-auto rounded-lg shadow-md"
                />
              )}
            </div>

            {/* Texto dinámico al lado de la imagen */}
            <div className="flex-1 text-gray-700">
              <Typography variant="paragraph" className="text-justify mb-4">
                {excursion.description}
              </Typography>
              {excursion.location && (
                <Typography variant="small" color="gray" className="text-lg mb-2">
                  <strong>Ubicación:</strong> {excursion.location}
                </Typography>
              )}
              {excursion.duration && (
                <Typography variant="small" color="gray" className="text-lg mb-2">
                  <strong>Duración:</strong> {excursion.duration} horas
                </Typography>
              )}
              {excursion.difficulty && (
                <Typography variant="small" color="gray" className="text-lg mb-2">
                  <strong>Dificultad:</strong> {excursion.difficulty}
                </Typography>
              )}
              {Array.isArray(excursion.guides) && excursion.guides.length > 0 ? (
                <div>
                  <Typography
                    variant="h6"
                    color="blue-gray"
                    className="text-lg font-semibold"
                  >
                    Guías:
                  </Typography>
                  <ul className="list-disc pl-6 text-gray-700">
                    {excursion.guides.map((guide, index) => (
                      <li key={index} className="text-gray-700">
                        {guide.name} - {guide.language}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <Typography variant="small" color="gray">
                  No hay guías disponibles.
                </Typography>
              )}
            </div>
          </div>

          {/* BookingCard */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 sticky top-24">
              <BookingCard id_Service={id_Service} price={excursion.price} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Detail;
