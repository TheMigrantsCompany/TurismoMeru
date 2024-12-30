import React, { useState, useEffect } from 'react';
import SearchInput from '../../../components/inputs/SearchInput';
import ReviewsTable from '../../../components/tables/admin/ReviewsTable';
import ReviewModal from '../../../components/modals/admin-modal/ReviewModal';

export function ReviewsManagement() {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch inicial de reseñas
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('http://localhost:3001/review/');
        if (!response.ok) throw new Error('Error al cargar las reseñas');
        const data = await response.json();
        setReviews(data);
        setFilteredReviews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Filtrar reseñas según búsqueda
  const handleSearch = (query) => {
    const lowercasedQuery = query.toLowerCase();
    setFilteredReviews(
      reviews.filter(
        (review) =>
          review.user.toLowerCase().includes(lowercasedQuery) ||
          review.comment.toLowerCase().includes(lowercasedQuery)
      )
    );
  };

  // Cambiar estado de la reseña (aprobar o desaprobar)
  const handleReviewStatusChange = async (reviewId, action) => {
    try {
      const response = await fetch(`http://localhost:3001/review/id/${reviewId}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (!response.ok) throw new Error('Error al cambiar el estado de la reseña');
  
      const updatedReview = await response.json();
  
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
      console.error(err.message);
    }
  };

  if (loading) return <div className="text-[#4256a6]">Cargando reseñas...</div>;
  if (error) return <div className="text-[#4256a6]">Error: {error}</div>;

  return (
    <div className="top-5 gap-5 flex flex-col w-full h-full p-6 bg-[#f9f3e1]">
      <h2 className="text-2xl text-[#4256a6] font-semibold mb-4">Gestión de Reseñas</h2>
      <SearchInput onSearch={handleSearch} className="mb-6" />
      <ReviewsTable
        reviews={filteredReviews}
        onReviewStatusChange={handleReviewStatusChange}
        onViewDetails={setSelectedReview}
      />
      {selectedReview && (
        <ReviewModal
          review={selectedReview}
          onClose={() => setSelectedReview(null)}
        />
      )}
    </div>
  );
}
