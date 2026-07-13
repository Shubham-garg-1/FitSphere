package com.fitsphere.repository;

import com.fitsphere.model.Trainer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TrainerRepository extends JpaRepository<Trainer, Long> {
    boolean existsByEmail(String email);
    Optional<Trainer> findByEmail(String email);
}
