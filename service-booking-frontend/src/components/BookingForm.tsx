import React, { useState} from 'react';
import { getAvailableTimeSlots } from '../services/serviceEntityApi';
import type { ReservationDto } from '../types/reservationDto';
import { createReservation } from '../services/reservationApi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface BookingFormProps {
  serviceId: number;
  onClose: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ serviceId, onClose }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState<Record<string, boolean> | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const {isLoggedIn} =useAuth()
  if(!isLoggedIn){
    navigate("/login")
  }
  const fetchSlots = async (date: string) => {
    setError('');
    setSlots(null);
    setSelectedTime(null);

    try {
      const result = await getAvailableTimeSlots(serviceId, date);
      setSlots(result);
    } catch (err: any) {
      setSlots(null);
      if (err.response?.data) {
        setError(err.response.data);
      } else {
        setError('Настана неочекувана грешка.');
      }
    }
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !note) {
      alert('Внесете ги сите полиња!');
      return;
    }

    try {
    const reservation: Partial<ReservationDto> = {
      date: selectedDate,
      time: selectedTime,
      description: note,
      service: { id: serviceId } as any,
    };

    await createReservation(reservation);    
    onClose();
    navigate('/myReservations')
  } catch (err: any) {
    console.error(err);
    alert('Настана грешка при креирање резервација.');
  }

  };

  return (
    <div className="modal d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Резервирај термин</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Избери датум:</label>
              <input
                type="date"
                className="form-control"
                value={selectedDate}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedDate(value);
                  if (value) fetchSlots(value);
                }}
              />
            </div>

            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            {slots && (
              <>
                <div className="mb-3">
                  <label className="form-label">Достапни термини:</label>
                  <div className="d-flex flex-wrap gap-2">
                    {Object.entries(slots).map(([time, isTaken]) => (
                      <button
                        key={time}
                        className={`btn ${
                          isTaken
                            ? 'btn-secondary'
                            : selectedTime === time
                            ? 'btn-success'
                            : 'btn-outline-primary'
                        }`}
                        disabled={isTaken}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Опис:</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={note}
                    required
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Затвори</button>
            <button className="btn btn-primary" onClick={handleSubmit}>Потврди</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
