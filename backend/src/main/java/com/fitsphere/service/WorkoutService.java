package com.fitsphere.service;

import com.fitsphere.dto.WorkoutDto;
import com.fitsphere.model.Workout;

import java.util.List;

public interface WorkoutService {
    Workout createWorkout(WorkoutDto dto);
    List<Workout> getAllWorkouts();
    Workout getWorkoutById(Long id);
    Workout updateWorkout(Long id, WorkoutDto dto);
    void deleteWorkout(Long id);
}
