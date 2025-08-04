package com.service.booking.backend.exceptions;

public class ServiceEntityNotFoundException extends RuntimeException {
    public ServiceEntityNotFoundException(Long id) {
        super("Service with id " + id + " not found");
    }
}
