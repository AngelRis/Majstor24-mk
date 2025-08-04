package com.service.booking.backend.services.implementation;

import com.service.booking.backend.dtos.ReservationDto;
import com.service.booking.backend.enums.ReservationStatusEnum;
import com.service.booking.backend.exceptions.ReservationNotFoundException;
import com.service.booking.backend.exceptions.ServiceEntityNotFoundException;
import com.service.booking.backend.mapper.ReservationMapper;
import com.service.booking.backend.models.Reservation;
import com.service.booking.backend.models.ServiceEntity;
import com.service.booking.backend.models.User;
import com.service.booking.backend.repositories.ReservationRepository;
import com.service.booking.backend.repositories.ServiceEntityRepository;
import com.service.booking.backend.repositories.UserRepository;
import com.service.booking.backend.services.ReservationService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservationServiceImpl implements ReservationService {
    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final ServiceEntityRepository  serviceEntityRepository;
    private final ReservationMapper reservationMapper=new ReservationMapper();
    private final JavaMailSender mailSender;
    @Value("${spring.mail.username}")
    private String fromEmail;
    public ReservationServiceImpl(ReservationRepository reservationRepository, UserRepository userRepository, ServiceEntityRepository serviceEntityRepository, JavaMailSender mailSender) {
        this.reservationRepository = reservationRepository;
        this.userRepository = userRepository;
        this.serviceEntityRepository = serviceEntityRepository;
        this.mailSender = mailSender;
    }

    @Override
    public Reservation createReservation(ReservationDto reservation) throws MessagingException {
        String username= SecurityContextHolder.getContext().getAuthentication().getName();
        User client=userRepository.findByUsername(username).orElseThrow(()-> new UsernameNotFoundException(username));
        ServiceEntity service=serviceEntityRepository.findById(reservation.getService().getId()).orElseThrow(()->new ServiceEntityNotFoundException(reservation.getService().getId()));
        Reservation reservationEntity = Reservation.builder()
                .date(reservation.getDate())
                .time(reservation.getTime())
                .description(reservation.getDescription())
                .client(client)
                .service(service)
                .status(ReservationStatusEnum.PENDING)
                .build();
        MimeMessage message = mailSender.createMimeMessage();

        MimeMessageHelper helper = new MimeMessageHelper(message, "UTF-8");
        helper.setTo(service.getProvider().getEmail());
        helper.setFrom(fromEmail);
        helper.setSubject("Имaте нов ангажман – клиент резервираше термин");

        String providerEmailContent = """
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .reservation-details { background-color: #f0f0f0; padding: 15px; border-radius: 5px; }
        .reservation-details h3 { margin-top: 0; color: #0066cc; }
        ul { list-style-type: none; padding-left: 0; }
        li { margin-bottom: 10px; }
        .footer { margin-top: 20px; font-size: 0.9em; color: #666; }
    </style>
</head>
<body>
<div class="container">
    <h4>Почитуван/а %s,</h4>
    <p><strong>Имате нова резервација!</strong></p>
    <div class="reservation-details">
        <h3>Детали за резервацијата:</h3>
        <ul>
            <li><strong>Клиент:</strong> %s</li>
            <li><strong>Телефон:</strong> %s</li>
            <li><strong>Услуга:</strong> %s</li>
            <li><strong>Дата и време на термин:</strong> %s %s</li>
            <li><strong>Опис од клиентот:</strong> %s</li>
            <li><strong>Статус на резервација:</strong> %s</li>
        </ul>
    </div>
    <p>Ве молиме, контактирајте го клиентот доколку е потребно и направете промена на статусот на резервазијата преку веб страната.</p>
    <div class="footer">
        <p>Со почит,<br>Тимот на Majstor24</p>
    </div>
</div>
</body>
</html>
""".formatted(
                service.getProvider().getFullName(),
                client.getFullName(),
                client.getPhone(),
                service.getTitle(),
                reservationEntity.getDate().toString(),
                reservationEntity.getTime().toString(),
                reservationEntity.getDescription(),
                reservationEntity.getStatus().name()
        );
        helper.setText(providerEmailContent,true);
        mailSender.send(message);

        return reservationRepository.save(reservationEntity);
    }

    @Override
    public List<ReservationDto> findAllReservations() {
        String username= SecurityContextHolder.getContext().getAuthentication().getName();
        User client=userRepository.findByUsername(username).orElseThrow(()-> new UsernameNotFoundException(username));
        return reservationRepository.findAllByClient(client).stream().map(reservation -> reservationMapper.mapToReservationDto(reservation) ).toList();
    }

    @Override
    public List<ReservationDto> findAllReservationsForProvider() {
        String username= SecurityContextHolder.getContext().getAuthentication().getName();
        User provider=userRepository.findByUsername(username).orElseThrow(()-> new UsernameNotFoundException(username));

        return reservationRepository.findAllByServiceProvider(provider).stream().map(reservation -> reservationMapper.mapToReservationDto(reservation) ).toList();
    }

    @Override
    public Reservation changeStatus(long reservationId, String status) throws MessagingException {
        Reservation reservation =reservationRepository.findById(reservationId).orElseThrow(()->new ReservationNotFoundException(reservationId));
        reservation.setStatus(ReservationStatusEnum.valueOf(status));
        MimeMessage message = mailSender.createMimeMessage();

        MimeMessageHelper helper = new MimeMessageHelper(message, "UTF-8");
        helper.setTo(reservation.getClient().getEmail());
        helper.setFrom(fromEmail);
        helper.setSubject("Изведувачот го промени статусот на вашата резервација");

        String providerEmailContent = """
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .reservation-details { background-color: #f0f0f0; padding: 15px; border-radius: 5px; }
        .reservation-details h3 { margin-top: 0; color: #0066cc; }
        ul { list-style-type: none; padding-left: 0; }
        li { margin-bottom: 10px; }
        .footer { margin-top: 20px; font-size: 0.9em; color: #666; }
    </style>
</head>
<body>
<div class="container">
    <h4>Почитуван/а %s,</h4>
    <p><strong>Статусот на вашиот термин е ажуриран од изведувачот.</strong></p>
    <div class="reservation-details">
        <h3>Детали за резервацијата:</h3>
        <ul>
            <li><strong>Изведувач:</strong> %s</li>
            <li><strong>Телефон:</strong> %s</li>
            <li><strong>Услуга:</strong> %s</li>
            <li><strong>Дата и време на термин:</strong> %s %s</li>
            <li><strong>Ваш опис:</strong> %s</li>
            <li><strong>Статус на резервација:</strong> %s</li>
        </ul>
    </div>
    <p>Ви благодариме што не избравте. Доколку сакате, слободно оставете рецензија за услугата.</p>
    <div class="footer">
        <p>Со почит,<br>Тимот на Majstor24</p>
    </div>
</div>
</body>
</html>
""".formatted(
                reservation.getClient().getFullName(),
                reservation.getService().getProvider().getFullName(),
                reservation.getService().getProvider().getPhone(),
                reservation.getService().getTitle(),
                reservation.getDate().toString(),
                reservation.getTime().toString(),
                reservation.getDescription(),
                reservation.getStatus().name()
        );
        helper.setText(providerEmailContent,true);
        mailSender.send(message);

        return reservationRepository.save(reservation);
    }


}
