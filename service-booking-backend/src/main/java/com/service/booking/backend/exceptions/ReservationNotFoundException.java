package com.service.booking.backend.exceptions;

public class ReservationNotFoundException extends RuntimeException {
    public ReservationNotFoundException(long id) {
        super("Reservation with id " + id + " not found");
    }
}
