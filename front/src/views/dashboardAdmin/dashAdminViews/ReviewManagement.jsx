import React, { useState, useEffect } from 'react';
import SearchInput from '../../../components/inputs/SearchInput';
import ReviewsTable from '../../../components/tables/admin/ReviewsTable';
import ReviewModal from '../../../components/modals/admin-modal/ReviewModal';
import axios from 'axios';

export function ReviewsManagement() {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  // Fetch inicial de reseñas
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://localhost:3001/review/');
        setReviews(response.data);
        setFilteredReviews(response.data);
      } catch (err) {
        setError('Error al cargar las reseñas');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Filtrar reseñas según el título del servicio
  const handleSearch = async (query) => {
    if (!query) {
      setFilteredReviews(reviews);
      return;
    }
  
    setSearchLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3001/review/service/${encodeURIComponent(query)}`
      );
  
      if (response.data && response.data.length > 0) {
        setFilteredReviews(response.data);
      } else {
        setFilteredReviews([]);
        console.warn('No se encontraron reseñas para el término buscado.');
      }
    } catch (err) {
      console.error('Error al buscar reseñas:', err.message);
      setFilteredReviews([]);
    } finally {
      setSearchLoading(false);
    }
  };
  

  // Cambiar estado de la reseña (aprobar o desaprobar)
  const handleReviewStatusChange = async (reviewId, action) => {
    try {
      const response = await axios.patch(
        `http://localhost:3001/review/id/${reviewId}/approve`
      );
      const updatedReview = response.data;

      // Actualizar el estado local con la reseña aprobada
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id_Review === updatedReview.id_Review ? updatedReview : review
        )
      );

      setFilteredReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id_Review === updatedReview.id_Review ? updatedReview : review
        )
      );
    } catch (err) {
      console.error('Error al cambiar el estado de la reseña:', err.message);
    }
  };

  // Mostrar mensajes según el estado de carga o error
  if (loading) return <div className="text-[#4256a6]">Cargando reseñas...</div>;
  if (error) return (
    <div className="text-[#4256a6]">
      Error: {error} <button onClick={() => window.location.reload()}>Reintentar</button>
    </div>
  );

  return (
    <div className="top-5 gap-5 flex flex-col w-full h-full p-6 bg-[#f9f3e1]">
      <h2 className="text-2xl text-[#4256a6] font-semibold mb-4">Gestión de Reseñas</h2>
      <SearchInput onSearch={handleSearch} className="mb-6" />
      
      {searchLoading ? (
        <p className="text-[#4256a6] text-center">Buscando reseñas...</p>
      ) : filteredReviews.length === 0 ? (
        <p className="text-[#4256a6] text-center">
          No se encontraron reseñas para el término ingresado.
        </p>
      ) : (
        <ReviewsTable
          reviews={filteredReviews}
          onReviewStatusChange={handleReviewStatusChange}
          onViewDetails={setSelectedReview}
        />
      )}
      
      {selectedReview && (
        <ReviewModal
          review={selectedReview}
          onClose={() => setSelectedReview(null)}
        />
      )}
    </div>
  );
}