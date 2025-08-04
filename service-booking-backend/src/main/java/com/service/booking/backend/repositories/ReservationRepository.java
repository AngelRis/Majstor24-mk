package com.service.booking.backend.repositories;

import com.service.booking.backend.models.Reservation;
import com.service.booking.backend.models.ServiceEntity;
import com.service.booking.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation,Long> {
    List<Reservation> findAllByServiceAndDate(ServiceEntity service, LocalDate date);
    List<Reservation> findAllByClient(User user);
    List<Reservation> findAllByServiceProvider(User user);
    void deleteAllByService(ServiceEntity service);
}
