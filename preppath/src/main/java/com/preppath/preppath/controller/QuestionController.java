package com.preppath.preppath.controller;

import com.preppath.preppath.entity.Question;
import com.preppath.preppath.service.QuestionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/topics/{topicId}/questions")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @PostMapping
    public ResponseEntity<Question> createQuestion(
            @PathVariable Long topicId,
            @Valid @RequestBody Question question) {

        if (topicId <= 0) {
            return ResponseEntity.badRequest().build();
        }

        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(questionService.create(topicId, question));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Question>> getQuestionsForTopic(@PathVariable Long topicId) {
        if (topicId <= 0) {
            return ResponseEntity.badRequest().build();
        }

        try {
            return ResponseEntity.ok(questionService.getAllByTopic(topicId));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Question> getQuestion(
            @PathVariable Long topicId,
            @PathVariable Long id) {

        if (topicId <= 0 || id <= 0) {
            return ResponseEntity.badRequest().build();
        }

        return questionService.getById(topicId, id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Question> updateQuestion(
            @PathVariable Long topicId,
            @PathVariable Long id,
            @Valid @RequestBody Question question) {

        if (topicId <= 0 || id <= 0) {
            return ResponseEntity.badRequest().build();
        }

        try {
            return ResponseEntity.ok(questionService.update(topicId, id, question));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(
            @PathVariable Long topicId,
            @PathVariable Long id) {

        if (topicId <= 0 || id <= 0) {
            return ResponseEntity.badRequest().build();
        }

        try {
            questionService.delete(topicId, id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Returns field-level validation errors as a map — matches TopicController pattern.
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationErrors(
            MethodArgumentNotValidException exception) {

        Map<String, String> errors = new HashMap<>();

        exception.getBindingResult().getFieldErrors().forEach(error ->
                errors.putIfAbsent(error.getField(), error.getDefaultMessage())
        );

        return ResponseEntity.badRequest().body(errors);
    }
}
