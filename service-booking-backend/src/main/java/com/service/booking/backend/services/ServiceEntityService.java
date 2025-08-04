package com.service.booking.backend.services;

import com.service.booking.backend.dtos.ServiceDto;
import com.service.booking.backend.models.ServiceEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

public interface ServiceEntityService {
    List<ServiceDto> getAllServices();
    List<ServiceDto> filterServices(String serviceCategory,String city,boolean sortByRating,boolean sortByPrice);
    ServiceDto getServiceById(Long id);
    ServiceEntity createService(ServiceDto serviceDto, MultipartFile file) throws IOException;
    ServiceEntity updateService(ServiceDto serviceDto, MultipartFile file) throws IOException;
    void deleteService(Long id);
    List<ServiceDto> getServicesFromProvider(String username);
    Map<LocalTime,Boolean> getAvailableSlotsForService(Long id, LocalDate date);

}
