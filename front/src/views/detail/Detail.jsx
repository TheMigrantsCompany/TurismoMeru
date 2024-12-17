import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Avatar, Rating } from "@material-tailwind/react";
import BookingCard from "../../components/bookingcard/BookingCard";

const Review = ({ review, rating, userImage, userName }) => {
  return (
    <div className="px-8 text-center">
      <Typography variant="h2" color="blue-gray" className="mb-6 font-medium">
        &quot;{review}&quot;
      </Typography>
      <Avatar
        src={
          userImage ||
          "https://via.placeholder.com/50" // Imagen por defecto
        }
        alt={userName || "Usuario"}
        size="lg"
      />
      <Typography variant="h6" className="mt-4">
        {userName || "Usuario Anónimo"}
      </Typography>
      <Rating value={rating} readonly />
    </div>
  );
};

export function Detail() {
  const { id_Service } = useParams();
  const [excursion, setExcursion] = useState(null);
  const [reviews, setReviews] = useState([]); // Estado separado para las reseñas
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Fetch para obtener la información de la excursión
  useEffect(() => {
    fetch(`http://localhost:3001/service/id/${id_Service}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Datos de la excursión:", data);
        setExcursion(data);
      })
      .catch((error) =>
        console.error("Error al obtener los detalles de la excursión:", error)
      );
  }, [id_Service]);

  // Fetch para obtener las reseñas aprobadas de la excursión
  useEffect(() => {
    fetch("http://localhost:3001/review/")
      .then((response) => response.json())
      .then((data) => {
        console.log("Reseñas recibidas:", data);

        // Filtrar solo las reseñas aprobadas (active === true)
        const approvedReviews = data.filter(
          (review) => review.active === true && review.id_Service === id_Service
        );
        console.log("Reseñas aprobadas:", approvedReviews);
        setReviews(approvedReviews);
      })
      .catch((error) =>
        console.error("Error al obtener las reseñas:", error)
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
                <Typography
                  variant="small"
                  color="gray"
                  className="text-lg mb-2"
                >
                  <strong>Ubicación:</strong> {excursion.location}
                </Typography>
              )}
              {excursion.duration && (
                <Typography
                  variant="small"
                  color="gray"
                  className="text-lg mb-2"
                >
                  <strong>Duración:</strong> {excursion.duration} horas
                </Typography>
              )}
              {excursion.difficulty && (
                <Typography
                  variant="small"
                  color="gray"
                  className="text-lg mb-2"
                >
                  <strong>Dificultad:</strong> {excursion.difficulty}
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

        {/* Reseñas */}
        <div className="mt-12">
          <Typography variant="h4" className="font-bold text-gray-800 mb-6">
            Reseñas
          </Typography>
          {reviews && reviews.length > 0 ? (
            <div className="space-y-8">
              {reviews.map((review, index) => (
                <Review
                  key={index}
                  review={review.content}
                  rating={review.rating}
                  userImage={review.userImage} // Imagen del usuario
                  userName={review.userName} // Nombre del usuario
                />
              ))}
            </div>
          ) : (
            <Typography variant="small" color="gray">
              No hay reseñas disponibles para esta excursión.
            </Typography>
          )}
        </div>
      </div>
    </section>
  );
}

export default Detail;
