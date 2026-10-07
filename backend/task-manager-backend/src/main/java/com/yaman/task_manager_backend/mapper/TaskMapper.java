package com.yaman.task_manager_backend.mapper;

import com.yaman.task_manager_backend.dto.TaskResponseDTO;
import com.yaman.task_manager_backend.model.Task;
import org.springframework.stereotype.Component;


@Component
public class TaskMapper {
    public TaskResponseDTO toTaskResponseDTO(Task task){
        return new TaskResponseDTO(task.getId(), task.getTitle(), task.getStatus(),
                task.getDescription(),task.getCreatedAt(),task.getDueDate());
    }
}

