package com.fitsphere.service;

import com.fitsphere.dto.UserRegistrationDto;
import com.fitsphere.model.User;
import java.util.List;

public interface UserService {
    User registerUser(UserRegistrationDto userRegistrationDto);
    List<User> getAllUsers();
    User getUserById(Long id);
    User getUserByEmail(String email);
    List<User> getUsersByRole(com.fitsphere.model.Role role);
    User assignTrainer(Long clientId, Long trainerId);
    User assignWorkout(Long clientId, Long workoutId);
    User removeWorkout(Long clientId, Long workoutId);
}
