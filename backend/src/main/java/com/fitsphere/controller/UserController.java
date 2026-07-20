package com.fitsphere.controller;

import com.fitsphere.dto.UserRegistrationDto;
import com.fitsphere.model.User;
import com.fitsphere.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@Valid @RequestBody UserRegistrationDto userRegistrationDto) {
        User registeredUser = userService.registerUser(userRegistrationDto);
        return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{clientId}/assign-workout/{workoutId}")
    public ResponseEntity<User> assignWorkout(@PathVariable Long clientId, @PathVariable Long workoutId) {
        User updatedClient = userService.assignWorkout(clientId, workoutId);
        return ResponseEntity.ok(updatedClient);
    }

    @PutMapping("/{clientId}/remove-workout/{workoutId}")
    public ResponseEntity<User> removeWorkout(@PathVariable Long clientId, @PathVariable Long workoutId) {
        User updatedClient = userService.removeWorkout(clientId, workoutId);
        return ResponseEntity.ok(updatedClient);
    }
}
