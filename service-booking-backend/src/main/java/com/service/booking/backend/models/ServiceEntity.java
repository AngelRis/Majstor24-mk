package com.service.booking.backend.models;

import com.service.booking.backend.enums.CityEnum;
import com.service.booking.backend.enums.ServiceCategoryEnum;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String title;
    private String description;
    @Column(nullable = false)
    private double pricePerHour;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CityEnum city;
    @ManyToOne
    @JoinColumn(nullable = false)
    private User provider;
    @Column(nullable = false)
    private LocalTime workStartTime;
    @Column(nullable = false)
    private LocalTime workEndTime;
    @Column(nullable = false)
    private int duration;
    @ElementCollection
    @Enumerated(EnumType.STRING)
    private List<DayOfWeek> daysOfWeek=new ArrayList<>();
    @OneToMany(cascade = CascadeType.ALL,mappedBy = "service", orphanRemoval = true)
    private List<Review> reviews=new ArrayList<>();
    @Column(nullable = false)
    private String imageUrl;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ServiceCategoryEnum category;

}
