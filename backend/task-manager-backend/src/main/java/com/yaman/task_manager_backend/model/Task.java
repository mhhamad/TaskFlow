package com.yaman.task_manager_backend.model;

import jakarta.persistence.*;
import java.time.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Task")
public class Task {

    public enum Status{
        OPEN,
        IN_PROGRESS,
        CLOSED
    }

    @Id 
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn (name = "projectId", nullable = false)
    private Project project;

    @Column (
        name = "title",
        length = 35,
        nullable = false
    )
    private String title;

    @Column (
        name = "description",
        columnDefinition = "TEXT",
        nullable = true
    )
    private String description;

    @Enumerated(EnumType.STRING)
    @Column (
        name = "status",
        nullable = false
    )
    private Status status = Status.OPEN;

    @Column (
        name = "dueDate",
        nullable = true
    )
    private LocalDate dueDate;

    @Column (
        name = "createdAt",
        nullable = false
    )
    private LocalDateTime createdAt;
}
