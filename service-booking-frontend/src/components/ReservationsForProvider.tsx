import React, { useEffect, useState } from 'react';
import type { ReservationDto } from '../types/reservationDto';
import { getReservationsForProvider, updateReservationStatus } from '../services/reservationApi';
import { reservationStatus } from '../constants/reservationStatus';

const ReservationsForProvider: React.FC = () => {
  const [reservations, setReservations] = useState<ReservationDto[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getReservationsForProvider()
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

  const handleStatusUpdate = async (reservationId: number, newStatus: 'ACCEPTED' | 'REJECTED') => {
    try {
      await updateReservationStatus(reservationId, newStatus);
      setReservations((prev) =>
        prev.map((res) =>
          res.id === reservationId ? { ...res, status: newStatus } : res
        )
      );
    } catch (err: any) {
      console.error(err);
      alert('Неуспешна промена на статус.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Резервации за моите услуги</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <table className="table table-bordered mt-3">
        <thead className="table-light">
          <tr>
            <th>Датум</th>
            <th>Време</th>
            <th>Услуга</th>
            <th>Опис</th>
            <th>Клиент</th>
            <th>Телефон</th>
            <th>Статус</th>
            <th>Промена на статус</th>
          </tr>
        </thead>
        <tbody>
          {reservations.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center">Немате резервации.</td>
            </tr>
          ) : (
            reservations.map((res) => (
              <tr key={res.id}>
                <td>{res.date}</td>
                <td>{res.time}</td>
                <td>{res.service.title}</td>
                <td>{res.description}</td>
                <td>{res.client.fullName}</td>
                <td>{res.client.phone}</td>
                <td>{translateStatus(res.status)}</td>
                <td>
                  {res.status === 'PENDING' ? (
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleStatusUpdate(res.id, 'ACCEPTED')}
                      >
                        Прифати
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleStatusUpdate(res.id, 'REJECTED')}
                      >
                        Одбиј
                      </button>
                    </div>
                  ) : (
                    <span>—</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReservationsForProvider;
