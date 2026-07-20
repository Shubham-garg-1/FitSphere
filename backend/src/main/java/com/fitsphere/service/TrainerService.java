package com.fitsphere.service;

import com.fitsphere.dto.TrainerDto;
import com.fitsphere.model.Trainer;

import java.util.List;

public interface TrainerService {
    Trainer createTrainer(TrainerDto dto);
    List<Trainer> getAllTrainers();
    Trainer getTrainerById(Long id);
    Trainer updateTrainer(Long id, TrainerDto dto);
    void deleteTrainer(Long id);
    Trainer getTrainerByEmail(String email);
}
