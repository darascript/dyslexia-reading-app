package com.example.dyslexia.repository;

import com.example.dyslexia.model.Text;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TextRepository extends JpaRepository<Text, Long> {
    List<Text> findByUser_Username(String username);
}
