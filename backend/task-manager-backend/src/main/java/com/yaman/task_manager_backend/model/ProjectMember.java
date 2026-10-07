package com.yaman.task_manager_backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "ProjectMember", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "projectId", "email" })
})
public class ProjectMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "projectId", nullable = false)
    private Project project;

    @ManyToOne
    @JoinColumn(name = "email", nullable = false)
    private User user;

    @Column(name = "pinned", nullable = false)
    private Boolean pinned = false;

    @Column(name = "joinedAt", nullable = false)
    private LocalDateTime joinedAt;

}