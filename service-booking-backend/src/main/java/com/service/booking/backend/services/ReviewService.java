package com.service.booking.backend.services;

import com.service.booking.backend.dtos.ReviewDto;
import com.service.booking.backend.models.Review;

public interface ReviewService {
    Review createReview(Long serviceId,ReviewDto reviewDto);
}
