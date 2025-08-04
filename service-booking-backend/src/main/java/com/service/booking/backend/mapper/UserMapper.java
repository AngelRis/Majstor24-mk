package com.service.booking.backend.mapper;

import com.service.booking.backend.dtos.UserDto;
import com.service.booking.backend.models.User;

public class UserMapper {
    public UserDto maptoUserDto(User user) {
         return UserDto.builder()
                 .username(user.getUsername())
                 .fullName(user.getFullName())
                 .email(user.getEmail())
                 .phone(user.getPhone())
                 .build();
    }
}
