package com.service.booking.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private String username;

    private String email;

    private String password;

    private String confirmedPassword;

    private String fullName;

    private String phone;

    private String role;
}
