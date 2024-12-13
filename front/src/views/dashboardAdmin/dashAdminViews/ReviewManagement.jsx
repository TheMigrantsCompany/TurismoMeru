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

  const handleReviewStatusChange = (reviewId, status) => {
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.id === reviewId ? { ...review, status } : review
      )
    );
  };

  if (loading) return <div>Cargando reseñas...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="top-5 gap-5 flex flex-col w-full h-full">
      <SearchInput onSearch={handleSearch} />
      <h2 className="text-xl text-black font-semibold mb-4">Gestión de Reviews</h2>
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
