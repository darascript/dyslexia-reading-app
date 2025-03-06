package com.example.dyslexia.model;

import jakarta.persistence.*;

@Entity
public class Text {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    private String content;

    // Update to associate directly with User
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;  // Changed from UserPreferences to User

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
