package com.fitsphere.service;

import com.fitsphere.dto.WorkoutDto;
import com.fitsphere.model.Trainer;
import com.fitsphere.model.User;
import com.fitsphere.model.Workout;
import com.fitsphere.repository.TrainerRepository;
import com.fitsphere.repository.UserRepository;
import com.fitsphere.repository.WorkoutRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkoutServiceImpl implements WorkoutService {

    private final WorkoutRepository workoutRepository;
    private final TrainerRepository trainerRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public Workout createWorkout(WorkoutDto dto) {
        Trainer trainer = null;
        if (dto.getTrainerId() != null) {
            trainer = trainerRepository.findById(dto.getTrainerId())
                    .orElseThrow(() -> new RuntimeException("Trainer not found with id: " + dto.getTrainerId()));
        }

        Workout workout = Workout.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .durationMinutes(dto.getDurationMinutes())
                .difficulty(dto.getDifficulty())
                .trainer(trainer)
                .build();

        return workoutRepository.save(workout);
    }

    @Override
    public List<Workout> getAllWorkouts() {
        return workoutRepository.findAll();
    }

    @Override
    public Workout getWorkoutById(Long id) {
        return workoutRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workout not found with id: " + id));
    }

    @Override
    @Transactional
    public Workout updateWorkout(Long id, WorkoutDto dto) {
        Workout workout = getWorkoutById(id);

        Trainer trainer = null;
        if (dto.getTrainerId() != null) {
            trainer = trainerRepository.findById(dto.getTrainerId())
                    .orElseThrow(() -> new RuntimeException("Trainer not found with id: " + dto.getTrainerId()));
        }

        workout.setName(dto.getName());
        workout.setDescription(dto.getDescription());
        workout.setDurationMinutes(dto.getDurationMinutes());
        workout.setDifficulty(dto.getDifficulty());
        workout.setTrainer(trainer);

        return workoutRepository.save(workout);
    }

    @Override
    @Transactional
    public void deleteWorkout(Long id) {
        Workout workout = getWorkoutById(id);

        // Remove workout from all associated clients (users)
        if (workout.getClients() != null) {
            for (User client : workout.getClients()) {
                client.getWorkouts().remove(workout);
                userRepository.save(client);
            }
        }

        workoutRepository.delete(workout);
    }
}
