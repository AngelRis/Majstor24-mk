package com.service.booking.backend.controllers;

import com.service.booking.backend.dtos.ReservationDto;
import com.service.booking.backend.exceptions.ReservationNotFoundException;
import com.service.booking.backend.exceptions.ServiceEntityNotFoundException;
import com.service.booking.backend.services.ReservationService;
import jakarta.mail.MessagingException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {
    private final ReservationService  reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @PostMapping("/createReservation")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<?> createReservation(@RequestBody ReservationDto reservationDto) {
        try {
            return ResponseEntity.ok(reservationService.createReservation(reservationDto));
        }catch (UsernameNotFoundException | ServiceEntityNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }catch (MessagingException e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
    @GetMapping("/getMyReservations")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<?> getMyReservations(){
        try {
            return ResponseEntity.ok(reservationService.findAllReservations());
        }catch (UsernameNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @GetMapping("/getProviderReservations")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<?> getProviderReservations(){
        try {
            return ResponseEntity.ok(reservationService.findAllReservationsForProvider());
        }catch (UsernameNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @PutMapping("/changeStatus/{reservationId}")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<?> changeReservationStatus(@PathVariable("reservationId") long reservationId,@RequestParam("status")String status){
        try {
            return ResponseEntity.ok(reservationService.changeStatus(reservationId,status));
        }catch (ReservationNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }catch (MessagingException e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

}
