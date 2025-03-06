package com.example.dyslexia.controller;

import com.example.dyslexia.model.Text;
import com.example.dyslexia.service.TextService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/texts")
public class TextController {

    @Autowired
    private TextService textService;

    // Upload and extract text from a document
    @PostMapping("/upload")
    public ResponseEntity<?> uploadText(@RequestParam("file") MultipartFile file, @RequestParam("username") String username) {
        try {
            Text savedText = textService.saveText(file, username);
            return ResponseEntity.ok(savedText);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("File processing failed: " + e.getMessage());
        }
    }

    // Get all texts for a user
    @GetMapping("/user/{username}")
    public ResponseEntity<List<Text>> getUserTexts(@PathVariable String username) {
        return ResponseEntity.ok(textService.getUserTexts(username));
    }

    // Get a specific text by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getTextById(@PathVariable Long id) {
        Optional<Text> text = textService.getTextById(id);
        return text.map(ResponseEntity::ok)
                   .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Delete a text by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteText(@PathVariable Long id) {
        boolean deleted = textService.deleteText(id);
        return deleted ? ResponseEntity.ok("Text deleted successfully")
                       : ResponseEntity.notFound().build();
    }
}
