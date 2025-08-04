import { useAuth } from '../context/AuthContext';

import { useEffect, useState } from 'react';
import type { ServiceDto } from '../types/serviceDto';
import { getServicesFromProvider } from '../services/serviceEntityApi';
import { useNavigate } from 'react-router-dom';
import ServiceCard from './ServiceCard';


const MyServices = () => {
  const { username } = useAuth();
  const [services, setServices] = useState<ServiceDto[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    
    getServicesFromProvider(username)
      .then(setServices)
      .finally(() => setLoading(false));
  }, [username]);
  
  const handleDetails = (service: ServiceDto) => {
  navigate(`/serviceDetails/${service.id}`);
   };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">Мои услуги</h3>
        <button
          className="btn btn-success"
          onClick={() => navigate('/createService')} 
        >
            Креирај услуга
        </button>
      </div>
      {loading ? (
        <p className='mt-5 pt-5 text-center'>Се вчитува...</p>
      ) : services.length === 0 ? (
        <p className="text-muted my-5 py-5 text-center">Немате креирано услуги.</p>
      ) : (
        <div className="row">
          {services.map(service => (
            <div key={service.id} className="col-md-4 mb-4">
              <ServiceCard service={service} onDetailsClick={handleDetails} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyServices;
