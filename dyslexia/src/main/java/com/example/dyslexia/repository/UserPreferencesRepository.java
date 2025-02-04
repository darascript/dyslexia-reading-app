package com.example.dyslexia.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.dyslexia.model.UserPreferences;

@Repository
public interface UserPreferencesRepository extends JpaRepository<UserPreferences, Long> {
        UserPreferences findByUsername(String username);
}