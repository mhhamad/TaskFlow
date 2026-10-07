package com.yaman.task_manager_backend.mapper;

import com.yaman.task_manager_backend.dto.UserResponseDTO;
import com.yaman.task_manager_backend.dto.UserSignUpRequestDTO;
import com.yaman.task_manager_backend.model.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    public User toUser(UserSignUpRequestDTO requestDTO) {
        return new User(
                requestDTO.email(),
                requestDTO.username(),
                requestDTO.password()
        );
    }

    public UserResponseDTO toUserResponseDTO(User user) {
        return new UserResponseDTO(
                user.getEmail(),
                user.getUsername()
        );
    }
}
