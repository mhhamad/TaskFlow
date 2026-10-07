package com.yaman.task_manager_backend.exception;

public class ProjectAccessDeniedException extends RuntimeException {
    public ProjectAccessDeniedException() {
        super("Access denied: require Admin");
    }
}
