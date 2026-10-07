package com.yaman.task_manager_backend.controller;

import com.yaman.task_manager_backend.dto.ProjectCreateRequestDTO;
import com.yaman.task_manager_backend.dto.ProjectResponseDTO;
import com.yaman.task_manager_backend.security.AppUserDetails;
import com.yaman.task_manager_backend.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping("/projects")
    public ResponseEntity<ProjectResponseDTO> createProject(
            @Valid @RequestBody ProjectCreateRequestDTO dto,
            @AuthenticationPrincipal AppUserDetails principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(projectService.createProject(principal.getUsername(), dto));
    }

    @GetMapping("/projects")
    public ResponseEntity<List<ProjectResponseDTO>> getMyProjects(@AuthenticationPrincipal AppUserDetails principal) {
        return ResponseEntity.ok(projectService.getProjectsFor(principal.getUsername()));// principle username is out email
    }

    @GetMapping("/projects/{id}")
    public ResponseEntity<ProjectResponseDTO> getProjectByID(@AuthenticationPrincipal AppUserDetails principal,
                                                             @PathVariable Integer id){
        return ResponseEntity.ok(projectService.getProjectByID(principal.getUsername() , id));
    }
}