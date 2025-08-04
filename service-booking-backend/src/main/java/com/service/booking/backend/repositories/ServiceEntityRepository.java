package com.service.booking.backend.repositories;


import com.service.booking.backend.models.ServiceEntity;
import com.service.booking.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ServiceEntityRepository extends JpaRepository<ServiceEntity,Long> {
    List<ServiceEntity> getServiceEntitiesByProvider(User user);
    Optional<ServiceEntity> findById(long id);
}
