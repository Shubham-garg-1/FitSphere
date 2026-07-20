package com.fitsphere.service;

import com.fitsphere.dto.TrainerDto;
import com.fitsphere.exception.UserNotFoundException; // We can use it or runtime exception
import com.fitsphere.model.Trainer;
import com.fitsphere.model.User;
import com.fitsphere.repository.TrainerRepository;
import com.fitsphere.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TrainerServiceImpl implements TrainerService {

    private final TrainerRepository trainerRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public Trainer createTrainer(TrainerDto dto) {
        if (trainerRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Trainer with this email already exists");
        }

        Trainer trainer = Trainer.builder()
                .name(dto.getName())
                .specialization(dto.getSpecialization())
                .experience(dto.getExperience())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .build();

        return trainerRepository.save(trainer);
    }

    @Override
    public List<Trainer> getAllTrainers() {
        return trainerRepository.findAll();
    }

    @Override
    public Trainer getTrainerById(Long id) {
        return trainerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trainer not found with id: " + id));
    }

    @Override
    @Transactional
    public Trainer updateTrainer(Long id, TrainerDto dto) {
        Trainer trainer = getTrainerById(id);

        // If email is changing, check uniqueness
        if (!trainer.getEmail().equalsIgnoreCase(dto.getEmail()) && trainerRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Trainer with this email already exists");
        }

        trainer.setName(dto.getName());
        trainer.setSpecialization(dto.getSpecialization());
        trainer.setExperience(dto.getExperience());
        trainer.setEmail(dto.getEmail());
        trainer.setPhone(dto.getPhone());

        return trainerRepository.save(trainer);
    }

    @Override
    @Transactional
    public void deleteTrainer(Long id) {
        Trainer trainer = getTrainerById(id);

        // Nullify trainer reference for all clients assigned to this trainer
        if (trainer.getClients() != null) {
            for (User client : trainer.getClients()) {
                client.setTrainer(null);
                userRepository.save(client);
            }
        }

        trainerRepository.delete(trainer);
    }

    @Override
    public Trainer getTrainerByEmail(String email) {
        return trainerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Trainer not found with email: " + email));
    }
}
