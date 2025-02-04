package com.example.dyslexia.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.example.dyslexia.model.UserPreferences;
import com.example.dyslexia.service.UserPreferencesService;

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
        // Retrieve authenticated user from the token
        String authenticatedUsername = getAuthenticatedUsername();

        // Check if authentication is null or usernames don't match
        if (authenticatedUsername == null || !authenticatedUsername.equals(username)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // Fetch preferences from the service
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
        // Retrieve authenticated user from the token
        String authenticatedUsername = getAuthenticatedUsername();

        // Check if authentication is null or usernames don't match
        if (authenticatedUsername == null || !authenticatedUsername.equals(username)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // Save preferences using the service
        preferences.setUsername(username);
        UserPreferences savedPreferences = service.saveUserPreferences(preferences);
        return ResponseEntity.ok(savedPreferences);
    }
}
