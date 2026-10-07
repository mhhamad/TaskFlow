package com.yaman.task_manager_backend.repository;
import com.yaman.task_manager_backend.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import com.yaman.task_manager_backend.model.ProjectMember;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;


public interface ProjectMemberRepo extends JpaRepository<ProjectMember, Integer> {

    @Query("select pm.project from ProjectMember pm where pm.user.email = :email")
    List<Project> findProjectsByMemberEmail(@Param("email") String email);

    @Query("select pm.project from ProjectMember pm where pm.project.id = :id and pm.user.email = :email")
    Optional<Project> findProjectIfMember(@Param("id") Integer id, @Param("email") String email);

    List<ProjectMember> findAllByProject_Id(Integer projectID);
}
