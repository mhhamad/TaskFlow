package com.yaman.task_manager_backend.dto;

import com.yaman.task_manager_backend.model.Task;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record TaskResponseDTO(Integer id, String title , Task.Status status,
                              String description, LocalDateTime createdAt , LocalDate dueDate ) {
}
