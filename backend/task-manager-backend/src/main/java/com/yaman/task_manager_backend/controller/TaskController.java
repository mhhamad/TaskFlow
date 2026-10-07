package com.yaman.task_manager_backend.controller;

import com.yaman.task_manager_backend.dto.TaskCreateRequestDTO;
import com.yaman.task_manager_backend.dto.TaskResponseDTO;
import com.yaman.task_manager_backend.security.AppUserDetails;
import com.yaman.task_manager_backend.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class TaskController {
    final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }


    @PostMapping("/projects/{projectID}/tasks")
    public ResponseEntity<TaskResponseDTO> createTask(@AuthenticationPrincipal AppUserDetails principal,
                                                      @PathVariable Integer projectID,
                                                      @Valid @RequestBody TaskCreateRequestDTO dto){
    return ResponseEntity.status(HttpStatus.CREATED)
            .body(taskService.createTask(principal.getUsername(), projectID, dto)) ;
    }

    @GetMapping("/projects/{projectID}/tasks")
    public ResponseEntity<List<TaskResponseDTO>> getAllTasks(@AuthenticationPrincipal AppUserDetails principal,
                                                            @PathVariable Integer projectID){
        return ResponseEntity.ok(taskService.getAllTasks(principal.getUsername(), projectID));
    }
}
