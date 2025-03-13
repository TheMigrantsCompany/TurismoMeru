import { Carousel, Typography, IconButton } from "@material-tailwind/react";
import headerImages from "../../utils/headerImages.js";
import { useEffect, useState } from "react";

export default function CarouselWithContent() {
  const images = [headerImages.image1, headerImages.image2, headerImages.image3];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current === images.length - 1 ? 0 : current + 1));
    }, 10000); // Cambia la imagen cada 10 segundos

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <Carousel
      className="w-full h-[900px] rounded-lg overflow-hidden"
      autoplay={true}
      autoplayDelay={10000}
      loop={true}
      crossfade={true}
      prevArrow={({ handlePrev }) => (
        <IconButton
          variant="text"
          color="white"
          size="sm"
          onClick={handlePrev}
          className="!absolute top-2/4 left-4 -translate-y-2/4 bg-black/20 hover:bg-black/40 transition-all duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </IconButton>
      )}
      nextArrow={({ handleNext }) => (
        <IconButton
          variant="text"
          color="white"
          size="sm"
          onClick={handleNext}
          className="!absolute top-2/4 !right-4 -translate-y-2/4 bg-black/20 hover:bg-black/40 transition-all duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </IconButton>
      )}
      navigation={({ setActiveIndex, activeIndex, length }) => (
        <div className="absolute bottom-6 left-2/4 z-50 flex -translate-x-2/4 gap-3">
          {new Array(length).fill("").map((_, i) => (
            <span
              key={i}
              className={`block h-1.5 cursor-pointer rounded-full transition-all ${
                activeIndex === i
                  ? "w-6 bg-white/80"
                  : "w-3 bg-white/50"
              }`}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>
      )}
    >
      {images.map((image, index) => (
        <div key={index} className="relative h-full w-full">
          {/* Imagen */}
          <img
            src={image}
            alt={`Imagen del carrusel ${index + 1}`}
            className="h-full w-full object-cover"
          />

          {/* Filtro oscuro sobre la imagen */}
          <div className="absolute inset-0 grid h-full w-full place-items-center bg-black/40">
            {/* Contenido del carrusel */}
            <div className="w-3/4 text-center md:w-2/4">
              <Typography
                variant="h1"
                color="white"
                className="mb-6 text-4xl md:text-5xl lg:text-6xl font-bold drop-shadow-lg"
              >
                PAGINA EN CONSTRUCCIÓN. ENVIE SU CONSULTA LLENANDO EL FORMULARIO MAS ABAJO
              </Typography>
              <Typography
                variant="lead"
                color="white"
                className="mb-16 opacity-90 text-lg md:text-xl drop-shadow-md"
              >
                Gracias 
              </Typography>
            </div>
          </div>
        </div>
      ))}
    </Carousel>
  );
}
