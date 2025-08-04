package com.service.booking.backend.dtos;

import com.service.booking.backend.enums.CityEnum;
import com.service.booking.backend.enums.ServiceCategoryEnum;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceDto {
    private Long id;
    private String title;
    private String description;
    private double pricePerHour;
    private CityEnum city;
    private UserDto provider;
    private LocalTime workStartTime;
    private LocalTime workEndTime;
    private int duration;
    private List<DayOfWeek> daysOfWeek;
    private List<ReviewDto> reviews;
    private String imageUrl;
    private ServiceCategoryEnum category;
    private double rating;

}
