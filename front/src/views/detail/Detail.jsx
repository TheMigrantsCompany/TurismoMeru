import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Avatar, Rating } from "@material-tailwind/react";
import BookingCard from "../../components/bookingcard/BookingCard";

const Review = ({ review, rating, userImage, userName }) => {
  return (
    <div className="bg-[#dac9aa] text-[#152917] p-4 rounded-lg max-w-sm shadow-lg border-2 border-[#425a66]">
      <Typography variant="h6" color="blue-gray" className="text-center font-semibold text-[#152917]">
        &quot;{review}&quot;
      </Typography>
      <div className="flex justify-center items-center space-x-4">
        <Avatar
          src={userImage}
          alt={userName}
          size="lg"
        />
        <div className="text-center">
          <Typography variant="body1" color="blue-gray" className="mt-2 text-lg font-medium text-[#152917]">
            {userName}
          </Typography>
          <Rating value={rating} readonly size="sm" className="mt-2" />
        </div>
      </div>
    </div>
  );
};

export function Detail() {
  const { id_Service } = useParams();
  const [excursion, setExcursion] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:3001/service/id/${id_Service}`)
      .then((response) => response.json())
      .then((data) => {
        setExcursion(data);
      })
      .catch((error) => console.error("Error al obtener los detalles de la excursión:", error));
  }, [id_Service]);

  useEffect(() => {
    fetch("http://localhost:3001/review/")
      .then((response) => response.json())
      .then((data) => {
        const approvedReviews = data.filter(
          (review) => review.active === true && review.id_Service === id_Service
        );
        fetch("http://localhost:3001/user/")
          .then((userResponse) => userResponse.json())
          .then((users) => {
            const reviewsWithUserData = approvedReviews.map((review) => {
              const user = users.find((u) => u.id_User === review.id_User);
              return {
                ...review,
                userName: user?.name || "Usuario Anónimo",
                userImage: user?.image || "https://via.placeholder.com/50",
              };
            });
            setReviews(reviewsWithUserData);
          })
          .catch((userError) => console.error("Error al obtener los usuarios:", userError));
      })
      .catch((error) => console.error("Error al obtener las reseñas:", error));
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
    <section className="py-16 px-4 bg-[#dac9aa]">
    <div className="w-full px-4 lg:px-6">
      <Typography variant="h3" className="font-semibold text-gray-800 text-center mb-16 hover:text-f4925b transition-colors duration-300">
  {excursion.title}
</Typography>
      <div className="grid lg:grid-cols-3 gap-12">
        {/* Contenedor de fotos y descripción */}
        <div className="lg:col-span-2 flex flex-col lg:flex-row gap-12 items-start">
          {/* Fotos */}
          <div className="relative w-full lg:w-2/5">
            {photos.length > 0 ? (
              <div className="relative aspect-[3/2]">
                <img
                  src={photos[currentPhotoIndex]}
                  alt={`Foto ${currentPhotoIndex + 1} de la excursión ${excursion.title}`}
                  className="w-full h-full object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
                  onError={(e) => (e.target.src = "default_image_url.png")}
                />
                {photos.length > 1 && (
                  <>
                    <button
                      onClick={handlePreviousPhoto}
                      aria-label="Foto anterior"
                      className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      ❮
                    </button>
                    <button
                      onClick={handleNextPhoto}
                      aria-label="Foto siguiente"
                      className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      ❯
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="relative aspect-[3/2]">
                <img
                  src="default_image_url.png"
                  alt="Imagen por defecto"
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                />
              </div>
            )}
          </div>
          {/* Descripción */}
          <div className="flex-1 text-gray-700 lg:pl-8">
            <Typography variant="paragraph" className="text-justify mb-8 text-lg">
              {excursion.description}
            </Typography>
            
            {excursion.location && (
              <Typography variant="small" color="gray" className="text-lg mb-6">
                <strong>Ubicación:</strong> {excursion.location}
              </Typography>
            )}
            {excursion.duration && (
              <Typography variant="small" color="gray" className="text-lg mb-6">
                <strong>Duración:</strong> {excursion.duration} horas
              </Typography>
            )}
            {excursion.difficulty && (
              <Typography variant="small" color="gray" className="text-lg mb-6">
                <strong>Dificultad:</strong> {excursion.difficulty}
              </Typography>
            )}
          </div>
        </div>
  
        {/* BookingCard */}
        <div className="lg:col-span-1 mt-12 lg:mt-0">
          <BookingCard id_Service={id_Service} price={excursion.price} />
        </div>
      </div>
  
      {/* Reseñas */}
      <div className="mt-20">
  <Typography variant="h4" className="font-bold text-center text-gray-800 mb-12">
    Reseñas
  </Typography>
  {reviews && reviews.length > 0 ? (
    <div className="flex flex-wrap gap-8 justify-center">
      {reviews.map((review, index) => (
        <div key={index} className="w-full sm:w-1/2 lg:w-1/3">
          <Review
            review={review.content}
            rating={review.rating}
            userImage={review.userImage}
            userName={review.userName}
          >
            <Typography variant="small" color="gray" className="text-sm mt-2">
              {new Date(review.date).toLocaleDateString()}
            </Typography>
          </Review>
        </div>
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
