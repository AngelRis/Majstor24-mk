package com.service.booking.backend.repositories;

import com.service.booking.backend.models.Review;
import com.service.booking.backend.models.ServiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review,Long> {
    void  deleteAllByService(ServiceEntity service);
}
