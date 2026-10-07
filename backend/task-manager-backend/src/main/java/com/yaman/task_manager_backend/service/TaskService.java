package com.yaman.task_manager_backend.service;

import com.yaman.task_manager_backend.dto.TaskCreateRequestDTO;
import com.yaman.task_manager_backend.dto.TaskResponseDTO;
import com.yaman.task_manager_backend.mapper.TaskMapper;
import com.yaman.task_manager_backend.model.Project;
import com.yaman.task_manager_backend.model.Task;
import com.yaman.task_manager_backend.repository.TaskRepo;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;


@Service
public class TaskService {
    private final TaskRepo taskRepo;
    private final TaskMapper mapper;
    private final AuthorizationService authorizationService;


    public TaskService(TaskRepo taskRepo, TaskMapper mapper, AuthorizationService authorizationService) {
        this.taskRepo = taskRepo;
        this.mapper = mapper;
        this.authorizationService = authorizationService;
    }

    @Transactional
    public TaskResponseDTO createTask(String email, Integer projectID, TaskCreateRequestDTO requestDTO) {
        Project project = authorizationService.requireAdmin(email, projectID);

        Task task = new Task();
        task.setProject(project);
        task.setTitle(requestDTO.title());
        task.setDescription(requestDTO.description());
        task.setDueDate(requestDTO.dueDate());
        task.setCreatedAt(LocalDateTime.now());

        Task saved = taskRepo.save(task);
        return mapper.toTaskResponseDTO(saved);
    }

    public List<TaskResponseDTO> getAllTasks(String email, Integer projectID) {
        authorizationService.requireUser(email);
        authorizationService.requireMemberProject(email, projectID);

        return taskRepo.findAllByProject_Id(projectID).stream()
                .map(mapper::toTaskResponseDTO)
                .toList();
    }

}
