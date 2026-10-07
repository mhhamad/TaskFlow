package com.yaman.task_manager_backend.mapper;

import com.yaman.task_manager_backend.dto.ProjectResponseDTO;
import com.yaman.task_manager_backend.model.Project;
import org.springframework.stereotype.Component;

@Component                                   // so Spring can inject it (match how UserMapper is declared)
public class ProjectMapper {

    public ProjectResponseDTO toProjectResponseDTO(Project project) {   // public: the service is in another package
        return new ProjectResponseDTO(project.getId() ,project.getTitle(), project.getAdmin().getEmail(), project.getCreatedAt());
    }
}