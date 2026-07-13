package com.fitsphere.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "trainers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Trainer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String specialization;

    @Column(nullable = false)
    private Integer experience; // Experience in years

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String phone;

    @OneToMany(mappedBy = "trainer", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @JsonIgnore
    private List<Workout> workouts = new ArrayList<>();

    @OneToMany(mappedBy = "trainer")
    @Builder.Default
    @JsonIgnore
    private List<User> clients = new ArrayList<>();
}
