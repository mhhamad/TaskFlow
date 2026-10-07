package com.yaman.task_manager_backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.yaman.task_manager_backend.model.TaskAssignee;

public interface TaskAssigneeRepo extends JpaRepository<TaskAssignee, Integer> {
    
}
