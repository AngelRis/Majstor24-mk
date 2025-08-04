import { useEffect, useState } from 'react';
import { useFilter } from '../context/FilterContext';
import { getFilteredServices } from '../services/serviceEntityApi';
import type { ServiceDto } from '../types/serviceDto';
import ServiceCard from './ServiceCard';
import { useNavigate } from 'react-router-dom';

const ServiceList = () => {
  const { category, city, sortByPrice, sortByRating } = useFilter();
  const [services, setServices] = useState<ServiceDto[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    getFilteredServices(category, city, sortByPrice, sortByRating)
      .then(setServices)
      .catch(console.error);
  }, [category, city, sortByPrice, sortByRating]);

  const handleDetails = (service: ServiceDto) => {
  navigate(`/serviceDetails/${service.id}`);
   };

  return (
    <div className="row g-4">
      {services.map((service) => (
        <div className="col-md-4" key={service.id}>
          <ServiceCard service={service} onDetailsClick={handleDetails} />
        </div>
      ))}
    </div>
  );
};

export default ServiceList;