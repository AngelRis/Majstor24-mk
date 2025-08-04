package com.service.booking.backend.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "reviews")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private double rating;
    private String comment;
    @ManyToOne
    @JoinColumn(nullable = false)
    private User client;
    @ManyToOne
    @JoinColumn(nullable = false)
    private ServiceEntity service;
    @CreationTimestamp
    private LocalDateTime createdAt;
}
