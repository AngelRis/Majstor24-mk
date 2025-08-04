package com.service.booking.backend.dtos;

import com.service.booking.backend.enums.ReservationStatusEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class ReservationDto {
    private Long id;
    private LocalDate date;
    private LocalTime time;
    private ReservationStatusEnum status;
    private UserDto client;
    private ServiceDto service;
    private String description;
}
