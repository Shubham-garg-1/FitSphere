package com.fitsphere.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "workouts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Workout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(name = "duration_minutes", nullable = false)
    private Integer durationMinutes;

    @Column(nullable = false)
    private String difficulty; // e.g. "Beginner", "Intermediate", "Advanced"

    @ManyToOne
    @JoinColumn(name = "trainer_id")
    private Trainer trainer;

    @ManyToMany(mappedBy = "workouts")
    @Builder.Default
    @JsonIgnore
    private Set<User> clients = new HashSet<>();
}
