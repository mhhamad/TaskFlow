package com.yaman.task_manager_backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.yaman.task_manager_backend.model.Task;

import java.util.List;

public interface TaskRepo extends JpaRepository<Task, Integer> {
    List<Task> findAllByProject_Id(Integer projectId);
}
