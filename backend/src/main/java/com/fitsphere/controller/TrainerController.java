package com.fitsphere.controller;

import com.fitsphere.dto.TrainerDto;
import com.fitsphere.model.Trainer;
import com.fitsphere.service.TrainerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.fitsphere.model.User;
import com.fitsphere.model.Workout;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/trainers")
@RequiredArgsConstructor
public class TrainerController {

    private final TrainerService trainerService;

    @PostMapping
    public ResponseEntity<Trainer> createTrainer(@Valid @RequestBody TrainerDto dto) {
        Trainer trainer = trainerService.createTrainer(dto);
        return new ResponseEntity<>(trainer, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Trainer>> getAllTrainers() {
        List<Trainer> trainers = trainerService.getAllTrainers();
        return ResponseEntity.ok(trainers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Trainer> getTrainerById(@PathVariable Long id) {
        Trainer trainer = trainerService.getTrainerById(id);
        return ResponseEntity.ok(trainer);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Trainer> updateTrainer(@PathVariable Long id, @Valid @RequestBody TrainerDto dto) {
        Trainer updatedTrainer = trainerService.updateTrainer(id, dto);
        return ResponseEntity.ok(updatedTrainer);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrainer(@PathVariable Long id) {
        trainerService.deleteTrainer(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/profile")
    public ResponseEntity<Trainer> getTrainerProfile(Authentication authentication) {
        String email = authentication.getName();
        Trainer trainer = trainerService.getTrainerByEmail(email);
        return ResponseEntity.ok(trainer);
    }

    @GetMapping("/my-clients")
    public ResponseEntity<List<User>> getMyClients(Authentication authentication) {
        String email = authentication.getName();
        Trainer trainer = trainerService.getTrainerByEmail(email);
        return ResponseEntity.ok(trainer.getClients());
    }

    @GetMapping("/my-workouts")
    public ResponseEntity<List<Workout>> getMyWorkouts(Authentication authentication) {
        String email = authentication.getName();
        Trainer trainer = trainerService.getTrainerByEmail(email);
        return ResponseEntity.ok(trainer.getWorkouts());
    }
}
