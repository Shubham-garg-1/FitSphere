package com.fitsphere.controller;

import com.fitsphere.model.Role;
import com.fitsphere.model.Trainer;
import com.fitsphere.model.User;
import com.fitsphere.service.TrainerService;
import com.fitsphere.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final TrainerService trainerService;

    @GetMapping("/dashboard")
    public ResponseEntity<String> getAdminDashboard() {
        return ResponseEntity.ok("Admin Dashboard Access Granted");
    }

    @PutMapping("/assign-trainer")
    public ResponseEntity<User> assignTrainer(
            @RequestParam Long clientId,
            @RequestParam(required = false) Long trainerId
    ) {
        User updatedClient = userService.assignTrainer(clientId, trainerId);
        return ResponseEntity.ok(updatedClient);
    }

    @GetMapping("/trainers")
    public ResponseEntity<List<Trainer>> getAllTrainers() {
        List<Trainer> trainers = trainerService.getAllTrainers();
        return ResponseEntity.ok(trainers);
    }

    @GetMapping("/clients")
    public ResponseEntity<List<User>> getAllClients() {
        List<User> clients = userService.getUsersByRole(Role.USER);
        return ResponseEntity.ok(clients);
    }
}
