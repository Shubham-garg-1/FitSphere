package com.fitsphere.service;

import com.fitsphere.dto.UserRegistrationDto;
import com.fitsphere.exception.UserNotFoundException;
import com.fitsphere.model.User;
import com.fitsphere.model.Role;
import com.fitsphere.model.Trainer;
import com.fitsphere.repository.UserRepository;
import com.fitsphere.repository.TrainerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TrainerRepository trainerRepository;

    @Override
    public User registerUser(UserRegistrationDto userRegistrationDto) {
        if (userRepository.existsByEmail(userRegistrationDto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = User.builder()
                .name(userRegistrationDto.getName())
                .email(userRegistrationDto.getEmail())
                .password(passwordEncoder.encode(userRegistrationDto.getPassword()))
                .role(Role.USER)
                .build();

        return userRepository.save(user);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));
    }

    @Override
    public List<User> getUsersByRole(Role role) {
        return userRepository.findByRole(role);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public User assignTrainer(Long clientId, Long trainerId) {
        User client = getUserById(clientId);

        if (client.getRole() != Role.USER) {
            throw new RuntimeException("Trainer can only be assigned to a user with client (USER) role");
        }

        Trainer trainer = null;
        if (trainerId != null) {
            trainer = trainerRepository.findById(trainerId)
                    .orElseThrow(() -> new RuntimeException("Trainer not found with id: " + trainerId));
        }

        client.setTrainer(trainer);
        return userRepository.save(client);
    }
}
