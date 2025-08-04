package com.service.booking.backend.services;

import com.service.booking.backend.dtos.ReservationDto;
import com.service.booking.backend.models.Reservation;
import jakarta.mail.MessagingException;

import java.util.List;

public interface ReservationService {
    Reservation createReservation(ReservationDto reservation) throws MessagingException;
    List<ReservationDto> findAllReservations();
    List<ReservationDto> findAllReservationsForProvider();
    Reservation  changeStatus(long reservationId,String status) throws MessagingException;
}
