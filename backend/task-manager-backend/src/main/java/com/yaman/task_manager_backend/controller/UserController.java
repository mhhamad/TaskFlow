package com.yaman.task_manager_backend.controller;

import com.yaman.task_manager_backend.dto.UserResponseDTO;
import com.yaman.task_manager_backend.dto.UserSignInRequestDTO;
import com.yaman.task_manager_backend.dto.UserSignUpRequestDTO;
import com.yaman.task_manager_backend.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {
    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    // Crating a new account
    @PostMapping("/users/signup")
    public ResponseEntity<UserResponseDTO> SignUp(@Valid @RequestBody UserSignUpRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.signUp(dto));
    }

    // Signing in and existing account
    @PostMapping("/users/signin")
    public ResponseEntity<UserResponseDTO> signIn(@Valid @RequestBody UserSignInRequestDTO dto,
                                                  HttpServletRequest request,
                                                  HttpServletResponse response) {
        return ResponseEntity.ok(service.signIn(dto, request, response));
    }
}
