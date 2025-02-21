import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Avatar, Rating } from "@material-tailwind/react";
import BookingCard from "../../components/bookingcard/BookingCard";
import { motion } from "framer-motion";
import { AuthContext } from "../../firebase/AuthContext";
import api from "../../config/axios";

const Review = ({ review, rating, userImage, userName, date }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#f9f3e1] p-6 rounded-xl shadow-lg border border-[#425a66]/20 hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-start space-x-4">
        <Avatar
          src={userImage}
          alt={userName}
          size="lg"
          className="border-2 border-[#4256a6]"
        />
        <div className="flex-1">
          <Typography variant="h6" className="text-[#4256a6] font-semibold">
            {userName}
          </Typography>
          <div className="flex items-center space-x-2 mt-1">
            <Rating value={rating} readonly className="text-[#4256a6]" />
            <span className="text-sm text-[#425a66]">
              {new Date(date).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
      <Typography className="mt-4 text-[#425a66] italic">"{review}"</Typography>
    </motion.div>
  );
};

const PhotoGallery = ({ photos, title }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

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
    <div className="relative aspect-[16/9] rounded-xl overflow-hidden shadow-xl">
      <motion.img
        key={currentPhotoIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        src={photos[currentPhotoIndex]}
        alt={`Foto ${currentPhotoIndex + 1} de ${title}`}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.src =
            "https://images.unsplash.com/photo-1469474968028-56623f02e42e";
        }}
      />
      {photos.length > 1 && (
        <>
          <button
            onClick={handlePreviousPhoto}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
            aria-label="Foto anterior"
          >
            ❮
          </button>
          <button
            onClick={handleNextPhoto}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
            aria-label="Siguiente foto"
          >
            ❯
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {photos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPhotoIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentPhotoIndex ? "bg-white" : "bg-white/50"
                }`}
                aria-label={`Ir a foto ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export function Detail() {
  const { id_Service } = useParams();
  const [excursion, setExcursion] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isUserActive } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExcursionDetails = async () => {
      try {
        const response = await api.get(`/service/id/${id_Service}`);
        setExcursion(response.data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchReviews = async () => {
      try {
        const [reviewsResponse, usersResponse] = await Promise.all([
          api.get("/review/"),
          api.get("/user/"),
        ]);
        const reviewsData = reviewsResponse.data;
        const usersData = usersResponse.data;

        const approvedReviews = reviewsData
          .filter((review) => review.active && review.id_Service === id_Service)
          .map((review) => {
            const user = usersData.find((u) => u.id_User === review.id_User);
            return {
              ...review,
              userName: user?.name || "Usuario Anónimo",
              userImage: user?.image || "https://via.placeholder.com/50",
            };
          });

        setReviews(approvedReviews);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExcursionDetails();
    fetchReviews();
  }, [id_Service]);

  const handleAuthAlert = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f3e1]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#4256a6]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f3e1]">
        <div className="text-center">
          <Typography variant="h4" className="text-[#4256a6] mb-4">
            Oops! Algo salió mal
          </Typography>
          <Typography className="text-[#425a66]">{error}</Typography>
        </div>
      </div>
    );
  }

  if (!excursion) return null;

  const photos = excursion.photos || [];

  const renderDiscounts = () => {
    const hasDiscounts =
      excursion.discountForMinors > 0 || excursion.discountForSeniors > 0;
    if (!hasDiscounts) return null;

    return (
      <div className="bg-[#f9f3e1] rounded-xl p-8 shadow-lg">
        <Typography variant="h4" className="text-[#4256a6] mb-4">
          Descuentos Disponibles
        </Typography>
        <div className="grid md:grid-cols-2 gap-4">
          {excursion.discountForMinors > 0 && (
            <div className="bg-[#dac9aa]/30 p-4 rounded-lg">
              <Typography variant="h6" className="text-[#4256a6]">
                Menores de edad
              </Typography>
              <Typography className="text-[#425a66]">
                {excursion.discountForMinors}% de descuento
              </Typography>
            </div>
          )}
          {excursion.discountForSeniors > 0 && (
            <div className="bg-[#dac9aa]/30 p-4 rounded-lg">
              <Typography variant="h6" className="text-[#4256a6]">
                Adultos mayores
              </Typography>
              <Typography className="text-[#425a66]">
                {excursion.discountForSeniors}% de descuento
              </Typography>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#dac9aa] py-16 px-4"
    >
      <div className="container mx-auto max-w-7xl">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-4xl md:text-5xl font-bold text-[#4256a6] mb-4"
          >
            {excursion.title}
          </motion.h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contenido principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Galería de fotos */}
            <PhotoGallery photos={photos} title={excursion.title} />

            {/* Información básica */}
            <div className="bg-[#f9f3e1] rounded-xl p-8 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {excursion.location && (
                  <div className="flex flex-col items-center p-4 bg-[#dac9aa]/20 rounded-lg">
                    <i className="fas fa-map-marker-alt text-2xl text-[#4256a6] mb-2"></i>
                    <Typography
                      variant="h6"
                      className="text-[#4256a6] text-center text-sm font-semibold"
                    >
                      Ubicación
                    </Typography>
                    <Typography className="text-[#425a66] text-center mt-1">
                      {excursion.location}
                    </Typography>
                  </div>
                )}
                {excursion.duration && (
                  <div className="flex flex-col items-center p-4 bg-[#dac9aa]/20 rounded-lg">
                    <i className="fas fa-clock text-2xl text-[#4256a6] mb-2"></i>
                    <Typography
                      variant="h6"
                      className="text-[#4256a6] text-center text-sm font-semibold"
                    >
                      Duración
                    </Typography>
                    <Typography className="text-[#425a66] text-center mt-1">
                      {excursion.duration} horas
                    </Typography>
                  </div>
                )}
                {excursion.difficulty && (
                  <div className="flex flex-col items-center p-4 bg-[#dac9aa]/20 rounded-lg">
                    <i className="fas fa-mountain text-2xl text-[#4256a6] mb-2"></i>
                    <Typography
                      variant="h6"
                      className="text-[#4256a6] text-center text-sm font-semibold"
                    >
                      Dificultad
                    </Typography>
                    <Typography className="text-[#425a66] text-center mt-1">
                      {excursion.difficulty}
                    </Typography>
                  </div>
                )}
              </div>

              <Typography variant="h4" className="text-[#4256a6] mb-4">
                Sobre esta excursión
              </Typography>
              <Typography className="text-[#425a66] text-lg leading-relaxed">
                {excursion.description}
              </Typography>
            </div>

            {/* Reseñas */}
            <div className="bg-[#f9f3e1] rounded-xl p-8 shadow-lg">
              <Typography variant="h4" className="text-[#4256a6] mb-6">
                Opiniones de viajeros
              </Typography>
              {reviews.length > 0 ? (
                <div className="grid gap-6">
                  {reviews.map((review, index) => (
                    <Review
                      key={review.id_Review || index}
                      review={review.content}
                      rating={review.rating}
                      userImage={review.userImage}
                      userName={review.userName}
                      date={review.date}
                    />
                  ))}
                </div>
              ) : (
                <Typography className="text-center text-[#425a66] italic">
                  Aún no hay reseñas para esta excursión. ¡Sé el primero en
                  compartir tu experiencia!
                </Typography>
              )}
            </div>
          </div>

          {/* Tarjeta de reserva */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {user && isUserActive ? (
                <BookingCard id_Service={id_Service} price={excursion.price} />
              ) : (
                <div className="bg-[#dac9aa] text-[#152917] p-6 rounded-lg max-w-sm shadow-lg border-2 border-[#425a66]">
                  <h3 className="text-lg font-bold text-[#4256a6] mb-4">
                    ¿Quieres reservar esta excursión?
                  </h3>
                  {!user ? (
                    <p className="text-[#425a66] mb-4">
                      Para realizar una reserva, necesitas iniciar sesión o
                      crear una cuenta.
                    </p>
                  ) : (
                    <p className="text-[#425a66] mb-4">
                      Tu cuenta está deshabilitada. Por favor, contacta al
                      administrador para más información.
                    </p>
                  )}
                  {!user && (
                    <button
                      onClick={handleAuthAlert}
                      className="bg-[#4256a6] text-white w-full py-2 rounded hover:bg-[#2a3875] transition-colors duration-300"
                    >
                      Iniciar Sesión
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default Detail;
