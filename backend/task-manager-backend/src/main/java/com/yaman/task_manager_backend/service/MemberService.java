package com.yaman.task_manager_backend.service;

import com.yaman.task_manager_backend.dto.MemberCreateRequestDTO;
import com.yaman.task_manager_backend.dto.MemberResponseDTO;
import com.yaman.task_manager_backend.exception.UserAlreadyExistsException;
import com.yaman.task_manager_backend.mapper.MemberMapper;
import com.yaman.task_manager_backend.model.Project;
import com.yaman.task_manager_backend.model.ProjectMember;
import com.yaman.task_manager_backend.model.User;
import com.yaman.task_manager_backend.repository.ProjectMemberRepo;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MemberService {
    private final ProjectMemberRepo projectMemberRepo;
    private final MemberMapper mapper;
    private final AuthorizationService authorizationService;

    public MemberService(ProjectMemberRepo projectMemberRepo, MemberMapper mapper,AuthorizationService authorizationService) {
        this.projectMemberRepo = projectMemberRepo;
        this.mapper = mapper;
        this.authorizationService = authorizationService;
    }

    @Transactional
    public MemberResponseDTO addMemberToProject(String email, Integer projectID, MemberCreateRequestDTO requestDTO) {
        Project project = authorizationService.requireAdmin(email, projectID);
        User user = authorizationService.requireUser(requestDTO.email());
        if (authorizationService.isMemberOfProject(requestDTO.email(), projectID)) {
            throw new UserAlreadyExistsException("User already in the project");
        }

        ProjectMember pm = new ProjectMember();
        pm.setUser(user);
        pm.setProject(project);
        pm.setJoinedAt(LocalDateTime.now());

        ProjectMember saved = projectMemberRepo.save(pm);

        return mapper.toMemberResponseDTO(saved);
    }

    public List<MemberResponseDTO> getAllMembers(String email, Integer projectID) {
        authorizationService.requireUser(email);
        authorizationService.requireMemberProject(email, projectID);

        return projectMemberRepo.findAllByProject_Id(projectID).stream()
                .map(mapper::toMemberResponseDTO)
                .toList();
    }
}
