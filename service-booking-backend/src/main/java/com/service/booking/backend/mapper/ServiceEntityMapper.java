package com.service.booking.backend.mapper;

import com.service.booking.backend.dtos.ServiceDto;
import com.service.booking.backend.models.Review;
import com.service.booking.backend.models.ServiceEntity;
import java.util.stream.Collectors;

public class ServiceEntityMapper {

    public ServiceDto mapToServiceDto(ServiceEntity service){
       UserMapper userMapper = new UserMapper();
       ReviewMapper reviewMapper = new ReviewMapper();
       double rating=!service.getReviews().isEmpty()?service.getReviews().stream().mapToDouble(Review::getRating).sum()/service.getReviews().size():0.0;
       return  ServiceDto.builder()
               .id(service.getId())
               .title(service.getTitle())
               .description(service.getDescription())
               .pricePerHour(service.getPricePerHour())
               .city(service.getCity())
               .provider(userMapper.maptoUserDto(service.getProvider()))
               .workStartTime(service.getWorkStartTime())
               .workEndTime(service.getWorkEndTime())
               .duration(service.getDuration())
               .daysOfWeek(service.getDaysOfWeek())
               .reviews(service.getReviews().stream().map(reviewMapper::mapToReviewDto).collect(Collectors.toList()))
               .imageUrl(service.getImageUrl())
               .category(service.getCategory())
               .rating(rating)
               .build();
   }
}
