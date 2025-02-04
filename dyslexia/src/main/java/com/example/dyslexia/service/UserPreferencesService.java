package com.example.dyslexia.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.dyslexia.model.UserPreferences;
import com.example.dyslexia.repository.UserPreferencesRepository;

@Service
public class UserPreferencesService {

    @Autowired
    private UserPreferencesRepository repository;

    public UserPreferences getUserPreferences(String username) {
        return repository.findByUsername(username);
    }

    public UserPreferences saveUserPreferences(UserPreferences preferences) {
        UserPreferences existing = repository.findByUsername(preferences.getUsername());
        if (existing != null) {
            preferences.setId(existing.getId());
        }
        return repository.save(preferences);
    }

}
