package com.service.booking.backend.exceptions;

public class ServiceUnavailableForDateException extends RuntimeException {
    public ServiceUnavailableForDateException() {
        super("Услугата не е достапна за избраниот датум!");
    }
}
