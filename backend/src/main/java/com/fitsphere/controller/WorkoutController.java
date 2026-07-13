package com.fitsphere.controller;

import com.fitsphere.dto.WorkoutDto;
import com.fitsphere.model.Workout;
import com.fitsphere.service.WorkoutService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workouts")
@RequiredArgsConstructor
public class WorkoutController {

    private final WorkoutService workoutService;

    @PostMapping
    public ResponseEntity<Workout> createWorkout(@Valid @RequestBody WorkoutDto dto) {
        Workout workout = workoutService.createWorkout(dto);
        return new ResponseEntity<>(workout, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Workout>> getAllWorkouts() {
        List<Workout> workouts = workoutService.getAllWorkouts();
        return ResponseEntity.ok(workouts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Workout> getWorkoutById(@PathVariable Long id) {
        Workout workout = workoutService.getWorkoutById(id);
        return ResponseEntity.ok(workout);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Workout> updateWorkout(@PathVariable Long id, @Valid @RequestBody WorkoutDto dto) {
        Workout updatedWorkout = workoutService.updateWorkout(id, dto);
        return ResponseEntity.ok(updatedWorkout);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkout(@PathVariable Long id) {
        workoutService.deleteWorkout(id);
        return ResponseEntity.noContent().build();
    }
}
