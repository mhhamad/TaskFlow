package com.yaman.task_manager_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record TaskCreateRequestDTO(@NotBlank @Size(max = 35) String title , String description , LocalDate dueDate) {
}
