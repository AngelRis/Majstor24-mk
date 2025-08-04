package com.service.booking.backend.exceptions;

public class PasswordsDoNotMatchException extends RuntimeException {
    public PasswordsDoNotMatchException() {
        super("Лозинките не се совпаѓаат.");
    }
}