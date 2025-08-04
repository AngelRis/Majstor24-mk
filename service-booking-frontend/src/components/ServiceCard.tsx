import type { ServiceDto } from "../types/serviceDto";

interface Props {
  service: ServiceDto;
  onDetailsClick: (service: ServiceDto) => void;
}

const ServiceCard: React.FC<Props> = ({ service, onDetailsClick }) => {
  return (
    <div className="card shadow-sm h-100">
      {service.imageUrl && (
        <img
          src={service.imageUrl}
          alt={service.title}
          className="card-img-top"
          style={{ height: '180px', objectFit: 'cover' }}
        />
      )}
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{service.title}</h5>
        <p className="card-text">{service.city}</p>
        <p className="card-text">{service.provider.fullName}</p>
        <p className="card-text">{service.rating}</p>
        <p className="card-text">{service.category}</p>
        <p className="card-text">{service.daysOfWeek}</p>
        <p className="card-text text-muted">Цена: {service.pricePerHour} ден/час</p>
        <button
          className="btn btn-primary mt-auto"
          onClick={() => onDetailsClick(service)}
        >
          Детали
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;