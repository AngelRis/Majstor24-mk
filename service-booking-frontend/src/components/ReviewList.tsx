import React from "react";
import type { ReviewDto } from "../types/reviewDto";

interface ReviewListProps {
  reviews: ReviewDto[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  return (
    <div className="card shadow my-5">
      <div className="card-body">
        <h5 className="card-title">Рецензии</h5>
        {reviews.length === 0 ? (
          <p className="mt-3 text-muted">Нема рецензии за оваа услуга.</p>
        ) : (
          <div className="row">
            {reviews.map((review) => (
              <div key={review.id} className="col-md-6 w-100 mb-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h6 className="card-subtitle mb-2 text-primary">
                      {review.client.fullName}
                    </h6>
                    <p className="mb-1">
                      <strong>Оценка:</strong> {review.rating} / 5
                    </p>
                    <p className="card-text">{review.comment}</p>
                    <small className="text-muted">
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString()
                        : "Непознат датум"}
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewList;
