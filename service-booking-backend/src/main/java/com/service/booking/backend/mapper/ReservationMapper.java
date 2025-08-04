package com.service.booking.backend.mapper;

import com.service.booking.backend.dtos.ReservationDto;
import com.service.booking.backend.models.Reservation;

public class ReservationMapper {

    public ReservationDto mapToReservationDto(Reservation reservation){
        UserMapper userMapper = new UserMapper();
        ServiceEntityMapper serviceEntityMapper = new ServiceEntityMapper();
        return ReservationDto.builder()
                .id(reservation.getId())
                .date(reservation.getDate())
                .time(reservation.getTime())
                .description(reservation.getDescription())
                .status(reservation.getStatus())
                .client(userMapper.maptoUserDto(reservation.getClient()))
                .service(serviceEntityMapper.mapToServiceDto(reservation.getService()))
                .build();
    }
}
