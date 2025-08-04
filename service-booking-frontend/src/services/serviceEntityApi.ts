
import axios from 'axios';
import type { ServiceDto } from '../types/serviceDto';

const API_BASE_URL = 'http://localhost:8080/api/services';

export const createService = async (serviceDto: any, file: File) => {
  const formData = new FormData();
  formData.append('serviceDto', JSON.stringify(serviceDto));
  formData.append('file', file);
  const token = localStorage.getItem("token")
  return axios.post(`${API_BASE_URL}/createService`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`,
    },
  });
};
export const getServicesFromProvider = async (username:string): Promise<ServiceDto[]> => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_BASE_URL}/${username}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};
export const getServiceById = async (id: number): Promise<ServiceDto> => {
  const token = localStorage.getItem("token");

  const headers = token
    ? { Authorization: `Bearer ${token}` }
    : undefined;

  const response = await axios.get(`${API_BASE_URL}/details/${id}`, {
    headers,
  });

  return response.data;
};
export const deleteServiceById = async (id: number): Promise<void> => {
  const token = localStorage.getItem("token");
  await axios.delete(`${API_BASE_URL}/deleteService/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const updateService = async (
  serviceDto: ServiceDto,
  file?: File | null
) => {
  const formData = new FormData();
  formData.append('serviceDto', JSON.stringify(serviceDto));
  if (file) {
    formData.append('file', file);
  }

  const token = localStorage.getItem('token');
  return axios.put(`${API_BASE_URL}/updateService`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getFilteredServices = async (
  category: string,
  city: string,
  sortByPrice: boolean,
  sortByRating: boolean
): Promise<ServiceDto[]> => {
  const token = localStorage.getItem("token");

  const headers = token
    ? { Authorization: `Bearer ${token}` }
    : undefined;

  const response = await axios.get(`${API_BASE_URL}`, {
    params: {
      category,
      city,
      sortByPrice,
      sortByRating,
    },
    headers,
  });

  const data = Array.isArray(response.data) ? response.data : [];
  return data;
};


export const getAvailableTimeSlots = async (
  id: number,
  date: string
): Promise<Record<string, boolean>> => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_BASE_URL}/getTimeSlots/${id}`, {
    params: { date },
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};