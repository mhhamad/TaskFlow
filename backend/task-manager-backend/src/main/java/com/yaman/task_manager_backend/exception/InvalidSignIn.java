package com.yaman.task_manager_backend.exception;

public class InvalidSignIn extends RuntimeException {
    public InvalidSignIn() {
        super("Invalid email or password");
    }
}
