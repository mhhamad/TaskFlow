package com.yaman.task_manager_backend.service;

import com.yaman.task_manager_backend.exception.ProjectAccessDeniedException;
import com.yaman.task_manager_backend.exception.ProjectNotFoundException;
import com.yaman.task_manager_backend.exception.UserNotFound;
import com.yaman.task_manager_backend.model.Project;
import com.yaman.task_manager_backend.model.User;
import com.yaman.task_manager_backend.repository.ProjectMemberRepo;
import com.yaman.task_manager_backend.repository.UserRepo;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthorizationService {
    private final UserRepo userRepo;
    private final ProjectMemberRepo projectMemberRepo;

    public AuthorizationService(UserRepo userRepo, ProjectMemberRepo projectMemberRepo) {
        this.userRepo = userRepo;
        this.projectMemberRepo = projectMemberRepo;
    }

    public User requireUser(String email) {
        return userRepo.findById(email).
                orElseThrow(UserNotFound::new);
    }

    public boolean isMemberOfProject(String email, Integer projectID) {
        Optional<Project> project =  projectMemberRepo.findProjectIfMember(projectID, email);
        return project.map(value -> value.getId().equals(projectID))
                .orElse(false); // not exiting in any project or not in the targeted project.
    }

    public Project requireMemberProject(String email, Integer projectID) {
        return projectMemberRepo.findProjectIfMember(projectID, email)
                .orElseThrow(ProjectNotFoundException::new);   // 404 for missing project and for non-member
    }

    public Project requireAdmin(String email, Integer projectID) {
        Project project = requireMemberProject(email, projectID);
        if (!project.getAdmin().getEmail().equals(email))
            throw new ProjectAccessDeniedException();
        return project;
    }

}
