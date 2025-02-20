import React, { useEffect, useState } from 'react';
import { Rating } from '@material-tailwind/react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrders, getAllServices } from '../../redux/actions/actions';
import { useAuth } from "../../firebase/AuthContext";

// Imagen por defecto para excursiones sin foto
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2074&auto=format&fit=crop";

const Reviews = () => {
  const dispatch = useDispatch();
  const { id_User } = useAuth();
  const orders = useSelector((state) => state.orders.ordersList);
  const services = useSelector((state) => state.excursions);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState({});  // Objeto para almacenar todas las reseñas por id_ServiceOrder

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(getAllOrders()),
          dispatch(getAllServices())
        ]);

        // Obtener todas las reseñas existentes
        const response = await axios.get('http://localhost:3001/review');
        const reviewsData = response.data;
        
        // Crear un objeto con las reseñas indexadas por id_ServiceOrder
        const reviewsMap = {};
        reviewsData.forEach(review => {
          if (review.id_User === id_User) {
            reviewsMap[review.id_ServiceOrder] = review;
          }
        });
        
        setReviews(reviewsMap);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar las excursiones');
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch, id_User]);

  // Agregar useEffect para depuración
  useEffect(() => {
    if (services && orders) {
      console.log('Estado de Redux - Servicios:', services);
      console.log('Estado de Redux - Órdenes:', orders);
    }
  }, [services, orders]);

  // Función para verificar si una excursión ya pasó
  const isExcursionPast = (date) => {
    return new Date(date) < new Date();
  };

  // Filtrar órdenes pasadas del usuario
  const pastOrders = orders?.filter(order => {
    const excursionDate = new Date(order.paymentInformation?.[0]?.bookingDateTime || order.orderDate);
    return order.id_User === id_User && isExcursionPast(excursionDate);
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-[#4256a6] font-poppins">Cargando excursiones...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 font-poppins">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f3e1]/50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-[#4256a6] mb-2 font-poppins text-center">
            Mis Reseñas
          </h1>
          <p className="text-[#425a66] text-center mb-12 font-poppins">
            Comparte tu experiencia y ayuda a otros viajeros
          </p>

          {pastOrders?.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md mx-auto border-l-4 border-[#425a66]">
              <p className="text-[#4256a6] font-poppins text-lg">
                No tienes excursiones pasadas para reseñar.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {pastOrders.map((order) => {
                const serviceId = order.paymentInformation?.[0]?.ServiceId || 
                                order.paymentInformation?.[0]?.id_Service ||
                                order.Services?.[0]?.id_Service;
                
                const service = services?.find(s => s.id_Service === serviceId);
                const photos = Array.isArray(service?.photos) ? service.photos : [];
                const photoUrl = photos.length > 0 ? photos[0] : DEFAULT_IMAGE;
                const existingReview = reviews[order.id_ServiceOrder];
                
                return (
                  <Review
                    key={order.id_ServiceOrder}
                    excursionTitle={order.paymentInformation?.[0]?.serviceTitle || 
                                  order.paymentInformation?.[0]?.title ||
                                  service?.title || 
                                  'Excursión'}
                    excursionPhoto={photoUrl}
                    idService={serviceId}
                    idServiceOrder={order.id_ServiceOrder}
                    idUser={id_User}
                    orderDate={order.orderDate}
                    existingReview={existingReview}
                    onReviewSubmitted={(newReview) => {
                      setReviews(prev => ({
                        ...prev,
                        [order.id_ServiceOrder]: newReview
                      }));
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Review = ({ excursionTitle, excursionPhoto, idService, idServiceOrder, idUser, orderDate, existingReview, onReviewSubmitted }) => {
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (existingReview) {
      setReview(existingReview.content);
      setRating(existingReview.rating);
      setSubmitted(true);
    }
  }, [existingReview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/review/', {
        id_User: idUser,
        id_Service: idService,
        id_ServiceOrder: idServiceOrder,
        content: review,
        rating,
      });

      if (response.status === 201) {
        setSubmitted(true);
        onReviewSubmitted(response.data);
        console.log('Reseña guardada:', response.data);
      }
    } catch (err) {
      setError('Hubo un problema al guardar la reseña. Inténtalo de nuevo.');
      console.error('Error al guardar la reseña:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative h-48">
        <img
          src={excursionPhoto}
          alt={excursionTitle}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = DEFAULT_IMAGE;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="text-white font-semibold text-xl mb-2 line-clamp-1">{excursionTitle}</h3>
            <div className="flex items-center text-white/90 text-sm space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatDate(orderDate)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-semibold text-[#425a66] block mb-2">
                Calificación
              </label>
              <Rating
                value={rating}
                onChange={(value) => setRating(value)}
                className="text-[#4256a6]"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-[#425a66] block mb-2">
                Tu opinión
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="w-full p-4 border border-[#425a66]/20 rounded-lg focus:ring-2 focus:ring-[#4256a6] focus:border-transparent resize-none text-black bg-[#f9f3e1]/10 transition-all duration-200"
                rows="4"
                placeholder="Cuéntanos tu experiencia con esta excursión..."
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-[#4256a6] text-white py-3 rounded-lg hover:bg-[#334477] transition-all duration-300 font-medium shadow-md hover:shadow-lg"
            >
              Enviar Reseña
            </motion.button>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="bg-[#f9f3e1]/30 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[#4256a6] font-semibold">
                  Reseña enviada
                </p>
                <Rating value={rating} readonly className="text-[#4256a6]" />
              </div>
              <p className="text-[#425a66] text-sm italic bg-white/50 p-4 rounded-lg border border-[#425a66]/10">
                "{review}"
              </p>
              <p className="text-xs text-[#425a66]/70 mt-4 text-right">
                Gracias por compartir tu experiencia
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Reviews;
