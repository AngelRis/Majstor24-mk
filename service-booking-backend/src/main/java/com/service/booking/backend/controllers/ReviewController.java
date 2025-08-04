package com.service.booking.backend.controllers;

import com.service.booking.backend.dtos.ReviewDto;
import com.service.booking.backend.exceptions.ServiceEntityNotFoundException;
import com.service.booking.backend.services.ReviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping("/{serviceId}")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<?> createReview(@PathVariable("serviceId") Long serviceId,@RequestBody ReviewDto reviewDto){
         try {
             return ResponseEntity.ok().body(reviewService.createReview(serviceId,reviewDto));
         }catch (UsernameNotFoundException | ServiceEntityNotFoundException e){
             return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
         }
    }
}
