package com.service.booking.backend.security;

import com.service.booking.backend.dtos.LoginUserDto;
import com.service.booking.backend.dtos.UserDto;
import com.service.booking.backend.enums.RoleEnum;
import com.service.booking.backend.exceptions.PasswordsDoNotMatchException;
import com.service.booking.backend.exceptions.UsernameAlreadyExistsException;
import com.service.booking.backend.models.User;
import com.service.booking.backend.repositories.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {
    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    public AuthenticationService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    public User signup(UserDto input) {
        if(userRepository.findByUsername(input.getUsername()).isPresent()){
            throw new UsernameAlreadyExistsException();
        }
        if(!input.getPassword().equals(input.getConfirmedPassword())){
            throw new PasswordsDoNotMatchException();
        }
        User user = User.builder()
                .username(input.getUsername())
                .password(passwordEncoder.encode(input.getPassword()))
                .email(input.getEmail())
                .phone(input.getPhone())
                .role(RoleEnum.valueOf(input.getRole()))
                .fullName(input.getFullName()).build();

        return userRepository.save(user);
    }
    public User authenticate(LoginUserDto input) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        input.getUsername(),
                        input.getPassword()
                )
        );

        return userRepository.findByUsername(input.getUsername())
                .orElseThrow();
    }
}
