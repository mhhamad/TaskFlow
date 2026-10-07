package com.yaman.task_manager_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ProjectCreateRequestDTO(@NotBlank @Size(max = 35) String title) {
}
