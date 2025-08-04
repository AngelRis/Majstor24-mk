import axios from "axios";
import type { ReservationDto } from "../types/reservationDto";

const API_BASE_URL = 'http://localhost:8080/api/reservations';

export const createReservation = async (reservation: Partial<ReservationDto>) => {
  const token = localStorage.getItem('token'); 

  const response = await axios.post(`${API_BASE_URL}/createReservation`, reservation, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
export const getMyReservations = async ():Promise<ReservationDto[]> => {
  const token = localStorage.getItem('token');

  const response = await axios.get(`${API_BASE_URL}/getMyReservations`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
export const getReservationsForProvider = async () => {
  const token = localStorage.getItem('token');

  const response = await axios.get(`${API_BASE_URL}/getProviderReservations`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
export const updateReservationStatus = async (reservationId: number, status: 'ACCEPTED' | 'REJECTED') => {
  const token = localStorage.getItem('token');

  const response = await axios.put(
    `${API_BASE_URL}/changeStatus/${reservationId}?status=${status}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};