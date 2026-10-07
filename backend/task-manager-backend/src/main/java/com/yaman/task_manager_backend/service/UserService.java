package com.yaman.task_manager_backend.service;

import com.yaman.task_manager_backend.dto.UserResponseDTO;
import com.yaman.task_manager_backend.dto.UserSignInRequestDTO;
import com.yaman.task_manager_backend.dto.UserSignUpRequestDTO;
import com.yaman.task_manager_backend.exception.InvalidSignIn;
import com.yaman.task_manager_backend.exception.UserAlreadyExistsException;
import com.yaman.task_manager_backend.mapper.UserMapper;
import com.yaman.task_manager_backend.model.User;
import com.yaman.task_manager_backend.repository.UserRepo;
import com.yaman.task_manager_backend.security.AppUserDetails;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserMapper mapper;
    private final UserRepo userRepo;

    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository;

    public UserService(UserRepo userRepo, UserMapper userMapper, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, SecurityContextRepository securityContextRepository) {
        this.userRepo = userRepo;
        this.mapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.securityContextRepository = securityContextRepository;
    }

    public UserResponseDTO signUp(UserSignUpRequestDTO requestDTO) {
        User newUser = mapper.toUser(requestDTO);
        if (userRepo.existsById(newUser.getEmail())) {
            throw new UserAlreadyExistsException("User Already Exists!");
        }

        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
        User saved = userRepo.save(newUser);
        return mapper.toUserResponseDTO(saved);
    }

    public UserResponseDTO signIn(UserSignInRequestDTO requestDTO, HttpServletRequest request, HttpServletResponse response) {

        try {
            Authentication result = authenticationManager.authenticate(UsernamePasswordAuthenticationToken.unauthenticated(requestDTO.email(), requestDTO.password()));

            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(result);
            SecurityContextHolder.setContext(context);                    // this request
            securityContextRepository.saveContext(context, request, response); // future requests

            AppUserDetails principal = (AppUserDetails) result.getPrincipal();
            return mapper.toUserResponseDTO(principal.getUser());

        } catch (BadCredentialsException e) {
            throw new InvalidSignIn();
        }
    }

}
