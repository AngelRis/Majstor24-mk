package com.service.booking.backend.services.implementation;

import com.service.booking.backend.dtos.ReviewDto;
import com.service.booking.backend.exceptions.ServiceEntityNotFoundException;
import com.service.booking.backend.models.Review;
import com.service.booking.backend.models.ServiceEntity;
import com.service.booking.backend.models.User;
import com.service.booking.backend.repositories.ReviewRepository;
import com.service.booking.backend.repositories.ServiceEntityRepository;
import com.service.booking.backend.repositories.UserRepository;
import com.service.booking.backend.services.ReviewService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class ReviewServiceImpl implements ReviewService {
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final ServiceEntityRepository serviceEntityRepository;

    public ReviewServiceImpl(ReviewRepository reviewRepository, UserRepository userRepository, ServiceEntityRepository serviceEntityRepository) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.serviceEntityRepository = serviceEntityRepository;
    }


    @Override
    public Review createReview(Long serviceId,ReviewDto reviewDto) {
        ServiceEntity service=serviceEntityRepository.findById(serviceId).orElseThrow(()->new ServiceEntityNotFoundException(serviceId));
        String username= SecurityContextHolder.getContext().getAuthentication().getName();
        User client=userRepository.findByUsername(username).orElseThrow(()->new UsernameNotFoundException(username));
        Review review=Review.builder()
                .service(service)
                .client(client)
                .rating(reviewDto.getRating())
                .comment(reviewDto.getComment())
                .build();
        reviewRepository.save(review);
        return reviewRepository.save(review);
    }
}
