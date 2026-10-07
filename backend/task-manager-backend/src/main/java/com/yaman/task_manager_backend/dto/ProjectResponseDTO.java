package com.yaman.task_manager_backend.dto;

import java.time.LocalDateTime;

public record ProjectResponseDTO(Integer id ,String title, String adminEmail, LocalDateTime createdAt) {
}
