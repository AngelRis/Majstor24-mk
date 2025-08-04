import React, { useEffect, useState } from 'react';
import type { ReservationDto } from '../types/reservationDto';
import { getMyReservations } from '../services/reservationApi';
import { reservationStatus } from '../constants/reservationStatus';
import LeaveReviewModal from './LeaveReview';


const MyReservations: React.FC = () => {
  const [reservations, setReservations] = useState<ReservationDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [serviceId, setServiceId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getMyReservations()
      .then(setReservations)
      .catch((err) => {
        const msg = err?.response?.data || err.message || 'Настана грешка.';
        setError(msg);
      });
  }, []);

  const translateStatus = (status: string): string => {
    const found = reservationStatus.find((s) => s.value === status);
    return found ? found.label : status;
  };

  const handleOpenReviewModal = (serviceId: number) => {
    setServiceId(serviceId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setServiceId(null);
  };

  return (
    <div className="container mt-4">
      <h2>Мои Резервации</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <table className="table table-bordered mt-3">
        <thead className="table-light">
          <tr>
            <th>Датум</th>
            <th>Време</th>
            <th>Опис</th>
            <th>Услуга</th>
            <th>Изведувач</th>
            <th>Контакт</th>
            <th>Статус</th>
            <th>Дејство</th>
          </tr>
        </thead>
        <tbody>
          {reservations.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center">Немате резервации.</td>
            </tr>
          ) : (
            reservations.map((res) => (
              <tr key={res.id}>
                <td>{res.date}</td>
                <td>{res.time}</td>
                <td>{res.description}</td>
                <td>{res.service.title}</td>
                <td>{res.service.provider.fullName}</td>
                <td>{res.service.provider.phone}</td>
                <td>{translateStatus(res.status)}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm"
                    disabled={res.status !== 'ACCEPTED' && res.status !== 'REJECTED'}
                    onClick={() => handleOpenReviewModal(res.service.id)}
                  >
                    Остави рецензија
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showModal && serviceId && (
        <LeaveReviewModal
          serviceId={serviceId}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default MyReservations;
