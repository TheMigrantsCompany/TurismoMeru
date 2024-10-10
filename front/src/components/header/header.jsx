import { Carousel, Typography, } from "@material-tailwind/react";
import headerImages from "../../utils/headerImages.js";

export default function CarouselWithContent() {
  const images = [headerImages.image1, headerImages.image2, headerImages.image3];

  return (
    <Carousel className="rounded-l w-full h-[565px]">
      {images.map((image, index) => (
        <div key={index} className="relative h-full w-full transition-style">
          <img
            src={image}
            alt={`image ${index + 1}`}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 grid h-full w-full place-items-center bg-black/30">
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
  );
}