import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/reviews';

export const createReview = (serviceId: number, reviewDto: { rating: number; comment: string }) => {
  const token = localStorage.getItem('token');
  return axios.post(`${API_BASE_URL}/${serviceId}`, reviewDto, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};