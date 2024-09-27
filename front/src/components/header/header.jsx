import { useState, useEffect } from "react";
import { Carousel, Typography } from "@material-tailwind/react";
import headerImages from "../../utils/headerImages.js";
export default function CarouselWithContent() {
  const [activeIndex, setActiveIndex] = useState(0);
  const images = [headerImages.image1, headerImages.image2, headerImages.image3];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full">
      <Carousel className="w-full h-screen" autoplay={false} showArrows={false} showIndicators={false}>
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              activeIndex === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img src={image} alt={`Image ${index + 1}`} className="h-full w-full object-cover" />
            <div className="absolute inset-0 grid h-full w-full place-items-center bg-black/75">
              <div className="w-3/4 text-center md:w-2/4">
                <Typography
                  variant="h1"
                  color="white"
                  className="mb-4 text-3xl md:text-4xl lg:text-5xl"
                >
                  The Beauty of Nature
                </Typography>
                <Typography variant="lead" color="white" className="mb-12 opacity-80">
                  It is not so much for its beauty that the forest makes a claim upon men's hearts, as for that subtle
                  something, that quality of air that emanation from old trees, that so wonderfully changes and renews a
                  weary spirit.
                </Typography>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
      {/* Usamos Tailwind CSS para ocultar los controles de navegación */}
      <style jsx>{`
        .carousel-control-prev,
        .carousel-control-next {
          display: none;
        }
      `}</style>
    </div>
  );
}