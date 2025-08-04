import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { ServiceDto } from "../types/serviceDto";
import {
  deleteServiceById,
  getServiceById,
} from "../services/serviceEntityApi";
import ReviewList from "./ReviewList";
import BookingForm from "./BookingForm";
import { useAuth } from "../context/AuthContext";

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState<ServiceDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const {isLoggedIn,role,username}=useAuth()

  useEffect(() => {
    if (id) {
      getServiceById(Number(id))
        .then(setService)
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleEdit = () => {
    navigate(`/editService/${service?.id}`);
  };
  const handleReservationClick =()=>{
    if(!isLoggedIn)
    {
      navigate('/login')
    }else{
      setShowBooking(true)
    }
  }

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Дали сте сигурни дека сакате да ја избришете услугата?"
    );
    if (!confirmDelete || !service) return;

    try {
      await deleteServiceById(service.id);
      alert("Услугата е успешно избришана.");
      navigate("/myServices");
    } catch (error) {
      alert("Грешка при бришење.");
      console.error(error);
    }
  };

  if (loading)
    return <p className="mt-5 pt-5 text-center">Се вчитува...</p>;

  if (!service)
    return (
      <p className="mt-5 pt-5 text-center text-danger">
        Услугата не е пронајдена.
      </p>
    );

  return (
    <div className="container mt-5">
      <h2>Детали за услугата</h2>
      <div className="row mt-4">
        <div className="col-md-6">
          <img
            src={service.imageUrl}
            alt={service.title}
            className="img-fluid rounded shadow"
          />
        </div>
        <div className="col-md-6">
          <h4>{service.title}</h4>
          <p>
            <strong>Опис:</strong> {service.description}
          </p>
          <p>
            <strong>Категорија:</strong> {service.category}
          </p>
          <p>
            <strong>Цена:</strong> {service.pricePerHour} ден
          </p>
          <div className="d-flex gap-3 mt-4 flex-wrap">
            {isLoggedIn && role==="PROVIDER" && username===service.provider.username && (
              <>
              <button className="btn btn-primary" onClick={handleEdit}>
              Измени
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              Избриши
            </button>
            
              </>
            )}
            {
              (!isLoggedIn || (role==="CLIENT" && isLoggedIn==true ))&&(
             <button
              className="btn btn-success"
              onClick={handleReservationClick}
            >
              Резервирај термин
            </button>
              )
            }
            
          </div>
        </div>
      </div>

      <div className="row mt-4">
        {service.reviews && <ReviewList reviews={service.reviews} />}
      </div>

      {showBooking && (
        <BookingForm
          serviceId={service.id}
          onClose={() => setShowBooking(false)}
        />
      )}
    </div>
  );
};

export default ServiceDetails;
