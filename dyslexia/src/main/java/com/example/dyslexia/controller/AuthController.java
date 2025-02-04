package com.example.dyslexia.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.example.dyslexia.model.User;
import com.example.dyslexia.repository.UserRepository;
import com.example.dyslexia.security.JwtUtil;
 

@RestController
@RequestMapping("api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    

   
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
      
        if (userRepository.existsByUsername(user.getUsername())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already exists");
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

      
        userRepository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
    }

    
    @PostMapping("/login")
public ResponseEntity<Map<String, String>> login(@RequestBody User user) {
  
    System.out.println("Username: " + user.getUsername());
    System.out.println("Password: " + user.getPassword());

    try {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
        );

       
        String token = jwtUtil.generateToken(user.getUsername());
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        System.out.println("Authentication failed: " + e.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    }
}

}
