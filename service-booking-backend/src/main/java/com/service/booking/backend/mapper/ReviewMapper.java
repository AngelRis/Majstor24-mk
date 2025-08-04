package com.service.booking.backend.mapper;

import com.service.booking.backend.dtos.ReviewDto;
import com.service.booking.backend.models.Review;

public class ReviewMapper {
    public ReviewDto mapToReviewDto(Review review) {
        UserMapper userMapper = new UserMapper();
        return ReviewDto.builder()
                .id(review.getId())
                .client(userMapper.maptoUserDto(review.getClient()))
                .comment(review.getComment())
                .rating(review.getRating())
                .createdAt(review.getCreatedAt())
        .build();
    }
}
