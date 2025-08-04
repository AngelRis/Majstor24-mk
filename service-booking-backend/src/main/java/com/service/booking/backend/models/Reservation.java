package com.service.booking.backend.models;

import com.service.booking.backend.enums.ReservationStatusEnum;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "reservations")
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private LocalDate date;
    @Column(nullable = false)
    private LocalTime time;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReservationStatusEnum status;
    @ManyToOne
    @JoinColumn(nullable = false)
    private User client;
    @ManyToOne
    @JoinColumn(nullable = false)
    private ServiceEntity service;
    @Column(nullable = false)
    private String description;
}
