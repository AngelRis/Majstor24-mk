import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getServiceById, updateService } from '../services/serviceEntityApi';
import { cities } from '../constants/cities';
import { serviceCategories } from '../constants/serviceCategory';
import { daysOfWeek } from '../constants/daysOfWeek';
import type { ServiceDto } from '../types/serviceDto';
import type { ReviewDto } from '../types/reviewDto';

const EditServiceForm = () => {
  const [form, setForm] = useState<ServiceDto>({
    id: 0,
    title: '',
    description: '',
    pricePerHour: 0,
    city: '',
    workStartTime: '',
    workEndTime: '',
    duration: 0,
    daysOfWeek: [] as string[],
    category: '',
    reviews: [] as ReviewDto[],
    provider: null!,
    imageUrl: '',
    rating: 0

  });

  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchService = async () => {
      try {
        if (!id) return;
        const service = await getServiceById(Number(id));
        setForm(service);
      } catch (err) {
        console.error(err);
        alert('Не може да се вчита услугата.');
      }
    };
    fetchService();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDaysChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions).map(opt => opt.value);
    setForm({ ...form, daysOfWeek: options });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateService(form, file);
      navigate('/myServices');
    } catch (err) {
      console.error(err);
      alert('Грешка при ажурирање на услугата.');
    }
  };

  return (
    <form className="container mt-5 d-flex justify-content-center" onSubmit={handleSubmit}>
      <div className="card shadow p-4" style={{ maxWidth: '600px', width: '100%' }}>
        <h4 className="mb-4 text-center">Ажурирај услуга</h4>

        <div className="mb-3">
          <label htmlFor="title" className="form-label">Наслов</label>
          <input type="text" className="form-control" id="title" name="title" value={form.title} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">Опис</label>
          <textarea className="form-control" id="description" name="description" value={form.description} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label htmlFor="pricePerHour" className="form-label">Цена по час (денари)</label>
          <input type="number" className="form-control" id="pricePerHour" name="pricePerHour" value={form.pricePerHour} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label htmlFor="city" className="form-label">Град</label>
          <select className="form-select" id="city" name="city" value={form.city} onChange={handleChange} required>
            <option disabled value="">-- Избери град --</option>
            {cities.map(city => (
              <option key={city.value} value={city.value}>{city.label}</option>
            ))}
          </select>
        </div>

        <div className="row">
          <div className="col">
            <label htmlFor="workStartTime" className="form-label">Почетно време</label>
            <input type="time" className="form-control" id="workStartTime" name="workStartTime" value={form.workStartTime} onChange={handleChange} required />
          </div>
          <div className="col">
            <label htmlFor="workEndTime" className="form-label">Крајно време</label>
            <input type="time" className="form-control" id="workEndTime" name="workEndTime" value={form.workEndTime} onChange={handleChange} required />
          </div>
        </div>

        <div className="mb-3 mt-3">
          <label htmlFor="duration" className="form-label">Времетраење на термини (час.)</label>
          <input type="number" className="form-control" id="duration" name="duration" value={form.duration} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label htmlFor="daysOfWeek" className="form-label">Денови</label>
          <select multiple required className="form-select" id="daysOfWeek" name="daysOfWeek" value={form.daysOfWeek} onChange={handleDaysChange}>
            {daysOfWeek.map(day => (
              <option key={day.value} value={day.value}>{day.label}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="category" className="form-label">Категорија</label>
          <select className="form-select" id="category" name="category" value={form.category} onChange={handleChange} required>
            <option disabled value="">-- Избери категорија --</option>
            {serviceCategories.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="file" className="form-label">Слика (остави празно ако не менуваш)</label>
          <input type="file" className="form-control" id="file" accept="image/*" onChange={handleFileChange} />
        </div>

        <button type="submit" className="btn btn-warning w-100">Ажурирај услуга</button>
      </div>
    </form>
  );
};

export default EditServiceForm;
