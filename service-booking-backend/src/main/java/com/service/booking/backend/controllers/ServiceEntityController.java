package com.service.booking.backend.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.service.booking.backend.dtos.ServiceDto;
import com.service.booking.backend.exceptions.ServiceEntityNotFoundException;
import com.service.booking.backend.exceptions.ServiceUnavailableForDateException;
import com.service.booking.backend.models.ServiceEntity;
import com.service.booking.backend.services.ServiceEntityService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/services")
public class ServiceEntityController {
    private final ServiceEntityService serviceEntityService;

    public ServiceEntityController(ServiceEntityService serviceEntityService) {
        this.serviceEntityService = serviceEntityService;
    }
    @GetMapping()
    public ResponseEntity<List<ServiceDto>> getServices(@RequestParam(required = false) String category,
                                                        @RequestParam(required = false) String city,
                                                        @RequestParam(required = false) Boolean sortByPrice,
                                                        @RequestParam(required = false) Boolean sortByRating)

    {
        return ResponseEntity.ok(serviceEntityService.filterServices(category,city,sortByRating,sortByPrice));
    }
    @GetMapping("/{username}")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<?> getServicesFromProvider(@PathVariable String username){
        try {
            return ResponseEntity.ok(serviceEntityService.getServicesFromProvider(username));
        }catch (UsernameNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @GetMapping("/details/{id}")
    public ResponseEntity<?> getServiceDetails(@PathVariable Long id){
        try {
            return ResponseEntity.ok(serviceEntityService.getServiceById(id));
        }catch (ServiceEntityNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }


    @PostMapping(value = "/createService")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<?> createServiceEntity(@RequestPart("serviceDto") String serviceDtoJson,
                                                             @RequestPart("file") MultipartFile file) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.registerModule(new JavaTimeModule());
            objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
            ServiceDto serviceDto = objectMapper.readValue(serviceDtoJson, ServiceDto.class);
            ServiceEntity service=serviceEntityService.createService(serviceDto,file);
            return ResponseEntity.ok(service);
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IOException e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PutMapping (value = "/updateService")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<?> updateServiceEntity(
                                                  @RequestPart("serviceDto") String serviceDtoJson,
                                                  @RequestPart(value = "file",required = false) MultipartFile file) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.registerModule(new JavaTimeModule());
            objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
            ServiceDto serviceDto = objectMapper.readValue(serviceDtoJson, ServiceDto.class);
            ServiceEntity service=serviceEntityService.updateService(serviceDto,file);
            return ResponseEntity.ok(service);
        } catch (ServiceEntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IOException e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @DeleteMapping(value = "/deleteService/{id}")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<?> deleteServiceEntity(@PathVariable(value = "id") Long id) {
        try {
            serviceEntityService.deleteService(id);
            return ResponseEntity.ok().build();
        }catch (ServiceEntityNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }

    }
    @GetMapping(value = "/getTimeSlots/{id}")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<?> getTimeSlots(@PathVariable(value = "id") Long id,
                                          @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
                                          )
    {
       try{
          return ResponseEntity.ok(serviceEntityService.getAvailableSlotsForService(id, date));
       }catch (ServiceEntityNotFoundException e){
           return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
       }catch (ServiceUnavailableForDateException e){
           return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
       }
    }

}
