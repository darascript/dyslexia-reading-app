package com.example.dyslexia.controller;

import com.example.dyslexia.model.UserPreferences;
import com.example.dyslexia.service.UserPreferencesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/preferences")
public class UserPreferencesController {

    @Autowired
    private UserPreferencesService service;

    // Utility method to get the authenticated user's username
    private String getAuthenticatedUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            return null;
        }
        return authentication.getName();
    }

    // GET /api/preferences/{username}
    @GetMapping("/{username}")
    public ResponseEntity<UserPreferences> getPreferences(@PathVariable String username) {
        String authenticatedUsername = getAuthenticatedUsername();

        if (authenticatedUsername == null || !authenticatedUsername.equals(username)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        UserPreferences preferences = service.getUserPreferences(username);
        if (preferences == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(preferences);
    }

    // POST /api/preferences/{username}
    @PostMapping("/{username}")
    public ResponseEntity<UserPreferences> savePreferences(
            @PathVariable String username,
            @RequestBody UserPreferences preferences) {
        String authenticatedUsername = getAuthenticatedUsername();

        if (authenticatedUsername == null || !authenticatedUsername.equals(username)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        preferences.setUsername(username);
        UserPreferences savedPreferences = service.saveUserPreferences(preferences);
        return ResponseEntity.ok(savedPreferences);
    }
}
