package com.yaman.task_manager_backend.mapper;

import com.yaman.task_manager_backend.dto.MemberResponseDTO;
import com.yaman.task_manager_backend.model.ProjectMember;
import org.springframework.stereotype.Component;

@Component
public class MemberMapper {
    public MemberResponseDTO toMemberResponseDTO(ProjectMember pm) {
        return new MemberResponseDTO(pm.getUser().getEmail(), pm.getUser().getUsername(),
                pm.getProject().getId(), pm.getProject().getTitle());
    }
}
