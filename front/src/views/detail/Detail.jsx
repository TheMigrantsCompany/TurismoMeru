import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Rating } from "@material-tailwind/react";
import BookingCard from "../../components/bookingcard/BookingCard";

export function Detail() {
  const { id_Service } = useParams();
  const [excursion, setExcursion] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:3001/service/id/${id_Service}`)
      .then((response) => response.json())
      .then((data) => setExcursion(data))
      .catch((error) => console.error("Error fetching excursion details:", error));
  }, [id_Service]);

  if (!excursion) return <p>Loading...</p>;

  const photos = excursion.photos || [];

  return (
    <section className="py-16 px-8">
      <div className="mx-auto container grid place-items-center grid-cols-1 md:grid-cols-2">
        <div className="relative">
          {photos.length > 0 ? (
            <img
              src={photos[currentPhotoIndex]}
              alt={`Excursion photo ${currentPhotoIndex + 1}`}
              className="h-[36rem]"
              onError={(e) => (e.target.src = "default_image_url.png")}
            />
          ) : (
            <img src="default_image_url.png" alt="Default" className="h-[36rem]" />
          )}
          {photos.length > 1 && (
            <>
              <button
                onClick={() => setCurrentPhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1))}
                className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white bg-opacity-75 p-2 rounded-full"
              >
                ❮
              </button>
              <button
                onClick={() => setCurrentPhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1))}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white bg-opacity-75 p-2 rounded-full"
              >
                ❯
              </button>
            </>
          )}
        </div>
        <div className="mb-12">
          <Typography className="mb-4" variant="h3">
            {excursion.title}
          </Typography>
          <Typography variant="h5">${excursion.price}</Typography>
          <Typography className="!mt-4 text-base font-normal leading-[27px] text-black">
            {excursion.description}
          </Typography>
          
          <BookingCard id_Service={id_Service} price={excursion.price} />
        </div>
      </div>
    </section>
  );
}

export default Detail;
