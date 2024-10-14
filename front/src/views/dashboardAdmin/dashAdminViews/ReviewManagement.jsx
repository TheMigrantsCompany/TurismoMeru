import React, { useState } from 'react';
import SearchInput from '../../../components/inputs/SearchInput';
import ReviewsTable from '../../../components/tables/admin/ReviewsTable';
import ReviewModal from '../../../components/modals/admin-modal/ReviewModal'; 
// Información hardcodeada de reviews
const initialReviews = [
  {
    id: 1,
    serviceId: 101,
    user: 'Juan Pérez',
    rating: 4,
    comment: 'Excelente experiencia.',
    status: 'pending', // Estado inicial pendiente de aprobación
    date: '2024-10-01',
  },
  {
    id: 2,
    serviceId: 102,
    user: 'María López',
    rating: 5,
    comment: 'Increíble, volvería a hacerlo.',
    status: 'approved',
    date: '2024-09-15',
  },
  // Más reviews
];

export function ReviewsManagement() {
  const [reviews, setReviews] = useState(initialReviews);
  const [filteredReviews, setFilteredReviews] = useState(initialReviews);
  const [selectedReview, setSelectedReview] = useState(null);

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
