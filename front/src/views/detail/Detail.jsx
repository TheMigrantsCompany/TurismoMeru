import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, IconButton, Rating, Typography } from "@material-tailwind/react";
import { HeartIcon } from "@heroicons/react/24/outline";

export function Detail() {
  const { id_Service } = useParams();
  const [excursion, setExcursion] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0); // índice de la foto actual

  useEffect(() => {
    fetch(`http://localhost:3001/service/id/${id_Service}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched excursion data:", data); // Verifica el contenido de los datos obtenidos
        setExcursion(data);
      })
      .catch((error) => console.error("Error fetching excursion details:", error));
  }, [id_Service]);

  if (!excursion) return <p>Loading...</p>;

  const photos = excursion.photos || []; // Asegura que photos sea un array

  // Funciones para manejar el cambio de foto en el carrusel
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
    <section className="py-16 px-8">
      <div className="mx-auto container grid place-items-center grid-cols-1 md:grid-cols-2">
        {/* Carrusel de fotos */}
        <div className="relative">
          {photos.length > 0 ? (
            <img
              src={photos[currentPhotoIndex]}
              alt={`Excursion photo ${currentPhotoIndex + 1}`}
              className="h-[36rem]"
              onError={(e) => (e.target.src = "default_image_url.png")} // Maneja error de imagen no encontrada
            />
          ) : (
            <img src="default_image_url.png" alt="Default" className="h-[36rem]" />
          )}
          {/* Botones de navegación del carrusel */}
          {photos.length > 1 && (
            <>
              <button
                onClick={handlePreviousPhoto}
                className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white bg-opacity-75 p-2 rounded-full"
              >
                ❮
              </button>
              <button
                onClick={handleNextPhoto}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white bg-opacity-75 p-2 rounded-full"
              >
                ❯
              </button>
            </>
          )}
        </div>

        {/* Detalles de la excursión */}
        <div className="mb-12">
          <Typography className="mb-4" variant="h3">
            {excursion.title}
          </Typography>
          <Typography variant="h5">${excursion.price}</Typography>
          <Typography className="!mt-4 text-base font-normal leading-[27px] text-black">
            {excursion.description}
          </Typography>
          <div className="my-8 flex items-center gap-2">
            <Rating value={4} className="text-amber-500" />
            <Typography className="!text-sm font-bold text-black">
              4.0/5 (100 reviews)
            </Typography>
          </div>
          <Typography color="blue-gray" variant="h6">
            Color
          </Typography>
          <div className="mb-4 flex w-full items-center gap-3 md:w-1/2">
            <Button color="gray" className="w-52">
              Add to Cart
            </Button>
            <IconButton color="gray" variant="text" className="shrink-0">
              <HeartIcon className="h-6 w-6" />
            </IconButton>
          </div>
        </div>
      </div>

      <blockquote className="flex flex-col items-start p-4 mt-16 pl-80">
        <p className="max-w-2xl text-sm font-medium text-left text-black md:text-base lg:text-lg">
          "I recently used this website for a purchase and I was extremely satisfied with the ease
          of use and the variety of options available. The checkout process was seamless and the
          delivery was prompt."
        </p>
        <footer className="flex items-center gap-3 mt-4 md:mt-6">
          <img
            className="flex-shrink-0 w-10 h-10 border rounded-full border-black/10"
            src="https://loremflickr.com/g/200/200/girl"
            alt="Jane Doe"
            loading="lazy"
          />
          <a href="#" target="_blank" className="inline-block font-bold tracking-tight text-black">
            <p>Jane Doe</p>
            <p className="font-medium text-black/60">Founder of XYZ</p>
          </a>
        </footer>
      </blockquote>
    </section>
  );
}

export default Detail;
