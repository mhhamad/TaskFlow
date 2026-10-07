package com.yaman.task_manager_backend.service;

import com.yaman.task_manager_backend.dto.ProjectCreateRequestDTO;
import com.yaman.task_manager_backend.dto.ProjectResponseDTO;
import com.yaman.task_manager_backend.mapper.ProjectMapper;
import com.yaman.task_manager_backend.model.Project;
import com.yaman.task_manager_backend.model.ProjectMember;
import com.yaman.task_manager_backend.model.User;
import com.yaman.task_manager_backend.repository.ProjectMemberRepo;
import com.yaman.task_manager_backend.repository.ProjectRepo;
import com.yaman.task_manager_backend.repository.UserRepo;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProjectService {
    private final ProjectMemberRepo projectMemberRepo;
    private final ProjectMapper mapper;
    private final ProjectRepo projectRepo;
    private final UserRepo userRepo;
    private final AuthorizationService authorizationService;

    public ProjectService(ProjectMemberRepo projectMemberRepo, ProjectMapper mapper, ProjectRepo projectRepo, UserRepo userRepo, AuthorizationService authorizationService) {
        this.projectMemberRepo = projectMemberRepo;
        this.mapper = mapper;
        this.projectRepo = projectRepo;
        this.userRepo = userRepo;
        this.authorizationService = authorizationService;
    }

    @Transactional
    public ProjectResponseDTO createProject(String email, ProjectCreateRequestDTO dto) {
        User admin = userRepo.getReferenceById(email);

        Project project = new Project();
        project.setAdmin(admin);
        project.setTitle(dto.title());
        project.setCreatedAt(LocalDateTime.now());
        Project saved = projectRepo.save(project);

        ProjectMember membership = new ProjectMember();
        membership.setProject(saved);
        membership.setUser(admin);
        membership.setPinned(false);
        membership.setJoinedAt(LocalDateTime.now());
        projectMemberRepo.save(membership);

        return mapper.toProjectResponseDTO(saved);
    }

    public List<ProjectResponseDTO> getProjectsFor(String email) {
        return projectMemberRepo.findProjectsByMemberEmail(email).stream().map(mapper::toProjectResponseDTO).toList();
    }

    public ProjectResponseDTO getProjectByID(String email, Integer projectID) {
        Project project = authorizationService.requireMemberProject(email, projectID);
        return mapper.toProjectResponseDTO(project);
    }
}
