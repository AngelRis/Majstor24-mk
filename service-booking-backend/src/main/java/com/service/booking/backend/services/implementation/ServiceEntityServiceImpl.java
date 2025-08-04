package com.service.booking.backend.services.implementation;

import com.service.booking.backend.dtos.ServiceDto;
import com.service.booking.backend.enums.CityEnum;
import com.service.booking.backend.enums.ServiceCategoryEnum;
import com.service.booking.backend.exceptions.ServiceEntityNotFoundException;
import com.service.booking.backend.exceptions.ServiceUnavailableForDateException;
import com.service.booking.backend.mapper.ServiceEntityMapper;
import com.service.booking.backend.models.Reservation;
import com.service.booking.backend.models.ServiceEntity;
import com.service.booking.backend.models.User;
import com.service.booking.backend.repositories.ReservationRepository;
import com.service.booking.backend.repositories.ReviewRepository;
import com.service.booking.backend.repositories.ServiceEntityRepository;
import com.service.booking.backend.repositories.UserRepository;
import com.service.booking.backend.services.ServiceEntityService;
import jakarta.transaction.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

@Service
public class ServiceEntityServiceImpl implements ServiceEntityService {
    private final ServiceEntityRepository serviceEntityRepository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;
    private final ReservationRepository reservationRepository;
    private ServiceEntityMapper serviceEntityMapper=new ServiceEntityMapper();

    public ServiceEntityServiceImpl(ServiceEntityRepository serviceEntityRepository, UserRepository userRepository, ReviewRepository reviewRepository, ReservationRepository reservationRepository) {
        this.serviceEntityRepository = serviceEntityRepository;
        this.userRepository = userRepository;
        this.reviewRepository = reviewRepository;
        this.reservationRepository = reservationRepository;
    }

    @Override
    public List<ServiceDto> getAllServices() {
        return serviceEntityRepository.findAll().stream().map(serviceEntity -> serviceEntityMapper.mapToServiceDto(serviceEntity)).toList();
    }


    @Override
    public List<ServiceDto> filterServices(String serviceCategory, String city, boolean sortByRating, boolean sortByPrice) {
        List<ServiceDto> services=getAllServices();
        if(!serviceCategory.isEmpty()){
            services=services.stream().filter(service->service.getCategory().equals(ServiceCategoryEnum.valueOf(serviceCategory))).toList();
        }
        if(!city.isEmpty()){
           services=services.stream().filter(service->service.getCity().equals(CityEnum.valueOf(city))).toList();
        }
        if(sortByRating){
            services=services.stream().sorted(Comparator.comparingDouble(ServiceDto::getRating).reversed()).toList();
        }else if(sortByPrice){
            services=services.stream().sorted(Comparator.comparingDouble(ServiceDto::getPricePerHour)).toList();
        }
        return services;
    }

    @Override
    public ServiceDto getServiceById(Long id) {
        return serviceEntityRepository.findById(id).map(serviceEntity -> serviceEntityMapper.mapToServiceDto(serviceEntity)).orElseThrow(()-> new ServiceEntityNotFoundException(id));
    }

    @Override
    public ServiceEntity createService(ServiceDto serviceDto,MultipartFile file) throws IOException {
        String username= SecurityContextHolder.getContext().getAuthentication().getName();
        User provider=userRepository.findByUsername(username).orElseThrow(()-> new UsernameNotFoundException(username));
        String uploadDir = "uploads/images/";
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }
        Path path = Paths.get(uploadDir + file.getOriginalFilename());
        Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
        String imageApiUrl="http://localhost:8080/images/"+file.getOriginalFilename();

        ServiceEntity service=ServiceEntity.builder()
                .title(serviceDto.getTitle())
                .description(serviceDto.getDescription())
                .pricePerHour(serviceDto.getPricePerHour())
                .city(serviceDto.getCity())
                .provider(provider)
                .workStartTime(serviceDto.getWorkStartTime())
                .workEndTime(serviceDto.getWorkEndTime())
                .duration(serviceDto.getDuration())
                .daysOfWeek(serviceDto.getDaysOfWeek())
                .imageUrl(imageApiUrl)
                .category(serviceDto.getCategory())
                .build();

        return serviceEntityRepository.save(service);
    }

    @Override
    public ServiceEntity updateService(ServiceDto serviceDto, MultipartFile file) throws IOException {
        ServiceEntity service=serviceEntityRepository.findById(serviceDto.getId()).orElseThrow(()->new ServiceEntityNotFoundException(serviceDto.getId()));
        String imageApiUrl=service.getImageUrl();
        if(file!=null){
            String uploadDir = "uploads/images/";
            File dir = new File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }
            Path path = Paths.get(uploadDir + file.getOriginalFilename());
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
            imageApiUrl="http://localhost:8080/images/"+file.getOriginalFilename();
        }

                 service.setTitle(serviceDto.getTitle());
                 service.setDescription(serviceDto.getDescription());
                 service.setPricePerHour(serviceDto.getPricePerHour());
                 service.setCity(serviceDto.getCity());
                 service.setWorkStartTime(serviceDto.getWorkStartTime());
                 service.setWorkEndTime(serviceDto.getWorkEndTime());
                 service.setDuration(serviceDto.getDuration());
                 service.setDaysOfWeek(serviceDto.getDaysOfWeek());
                 service.setImageUrl(imageApiUrl);
                 service.setCategory(serviceDto.getCategory());

        return serviceEntityRepository.save(service);
    }
    @Transactional
    @Override
    public void deleteService(Long id) {
         ServiceEntity service=serviceEntityRepository.findById(id).orElseThrow(()->new ServiceEntityNotFoundException(id));
         reservationRepository.deleteAllByService(service);
         serviceEntityRepository.delete(service);
    }

    @Override
    public List<ServiceDto> getServicesFromProvider(String username) {
        User user=userRepository.findByUsername(username).orElseThrow(()->new UsernameNotFoundException(username));
        return serviceEntityRepository.getServiceEntitiesByProvider(user).stream().map(serviceEntity -> serviceEntityMapper.mapToServiceDto(serviceEntity)).toList();
    }

    @Override
    public Map<LocalTime, Boolean> getAvailableSlotsForService(Long id, LocalDate date) {
        Map<LocalTime, Boolean> timeSlots = new TreeMap<>();
        ServiceEntity service=this.serviceEntityRepository.findById(id).orElseThrow(()->new ServiceEntityNotFoundException(id));

        if(!service.getDaysOfWeek().contains(date.getDayOfWeek())){
           throw new ServiceUnavailableForDateException();
        }
        List<LocalTime> reservedTimeSlotsForDate=reservationRepository.findAllByServiceAndDate(service,date).stream().map(Reservation::getTime).toList();
        LocalTime current=service.getWorkStartTime();
        while (!current.isAfter(service.getWorkEndTime().minusHours(service.getDuration()))) {
            timeSlots.put(current, reservedTimeSlotsForDate.contains(current));
            current = current.plusHours(service.getDuration());
        }

        return timeSlots;
    }
}
