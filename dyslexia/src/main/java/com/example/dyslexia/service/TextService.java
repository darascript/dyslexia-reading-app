package com.example.dyslexia.service;

import com.example.dyslexia.model.Text;
import com.example.dyslexia.model.User;
import com.example.dyslexia.repository.TextRepository;
import com.example.dyslexia.repository.UserRepository; // Change to UserRepository
import org.apache.tika.Tika;
import org.apache.tika.exception.TikaException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class TextService {

    private final Tika tika = new Tika(); // Apache Tika instance

    @Autowired
    private TextRepository textRepository;

    @Autowired
    private UserRepository userRepository; // Inject UserRepository instead of UserPreferencesRepository

    // Extract text from the uploaded file
    public String extractText(MultipartFile file) throws IOException {
        try {
            return tika.parseToString(file.getInputStream());
        } catch (TikaException e) {
            throw new IOException("Failed to extract text from file.", e);
        }
    }

    // Save extracted text linked to a user
    public Text saveText(MultipartFile file, String username) throws IOException {
        String extractedText = extractText(file);

        // Find or create user
        Optional<User> userOpt = userRepository.findByUsername(username); // Changed to use UserRepository
        User user = userOpt.orElseGet(() -> {
            User newUser = new User();
            newUser.setUsername(username);
            return userRepository.save(newUser); // Save new user if not found
        });

        // Save text in the database, linking it to the user
        Text textEntry = new Text();
        textEntry.setContent(extractedText);
        textEntry.setUser(user); // Link text to the user
        return textRepository.save(textEntry);
    }

    // Get all saved texts for a user
    public List<Text> getUserTexts(String username) {
        return textRepository.findByUser_Username(username); // Changed to work with User
    }

    // Get a single text by ID
    public Optional<Text> getTextById(Long id) {
        return textRepository.findById(id);
    }

    // Delete a text by ID
    public boolean deleteText(Long id) {
        if (textRepository.existsById(id)) {
            textRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
