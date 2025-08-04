import React, { useState } from 'react';
import { createReview } from '../services/reviewApi';

interface Props {
  serviceId: number;
  onClose: () => void;
}

const LeaveReviewModal: React.FC<Props> = ({ serviceId, onClose }) => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !comment.trim()) {
      setError('Оценката и коментарот се задолжителни.');
      return;
    }

    try {
      await createReview(serviceId, { rating, comment });
      onClose();
      alert('Успешно оставена рецензија.');
    } catch (err: any) {
      setError(err?.response?.data || err.message || 'Грешка при зачувување.');
    }
  };

  return (
    <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-3">
          <div className="modal-header">
            <h5 className="modal-title">Остави рецензија</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}

              <div className="mb-3">
                <label className="form-label">Оценка:</label>
                <div>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      style={{
                        cursor: 'pointer',
                        fontSize: '1.8rem',
                        color: (hoveredRating || rating) >= star ? '#ffc107' : '#e4e5e9',
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Коментар:</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-success">Испрати</button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Затвори</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LeaveReviewModal;
