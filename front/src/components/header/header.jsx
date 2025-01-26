import { Carousel, Typography } from "@material-tailwind/react";
import headerImages from "../../utils/headerImages.js";

export default function CarouselWithContent() {
  const images = [headerImages.image1, headerImages.image2, headerImages.image3];

  return (
    <Carousel
      className="w-full h-[900px] rounded-lg overflow-hidden"
      navigation={({ setActiveIndex, activeIndex, length }) => (
        <div className="absolute bottom-6 left-2/4 z-50 flex -translate-x-2/4 gap-3">
          {new Array(length).fill("").map((_, i) => (
            <span
              key={i}
              className={`block h-2 cursor-pointer rounded-full transition-all ${
                activeIndex === i
                  ? "w-8 bg-white shadow-md"
                  : "w-4 bg-gray-400"
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
            className="h-full w-full object-cover transition-all duration-500 ease-in-out"
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
                Vivi una experiencia única en Ushuaia
              </Typography>
              <Typography
                variant="lead"
                color="white"
                className="mb-16 opacity-90 text-lg md:text-xl drop-shadow-md"
              >
                Fin del Mundo, principio de todo
              </Typography>
            </div>
          </div>
        </div>
      ))}
    </Carousel>
  );
}
