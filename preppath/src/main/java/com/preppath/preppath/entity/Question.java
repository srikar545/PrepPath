package com.preppath.preppath.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Entity
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The topic this question belongs to. Set by the service from the URL path variable.
    @ManyToOne(optional = false)
    @JoinColumn(name = "topic_id")
    private Topic topic;

    @NotBlank(message = "Question text is required")
    @Size(max = 1000, message = "Question text cannot exceed 1000 characters")
    @Column(length = 1000)
    private String text;

    @NotBlank(message = "Option A is required")
    @Size(max = 500, message = "Option A cannot exceed 500 characters")
    @Column(length = 500)
    private String optionA;

    @NotBlank(message = "Option B is required")
    @Size(max = 500, message = "Option B cannot exceed 500 characters")
    @Column(length = 500)
    private String optionB;

    @NotBlank(message = "Option C is required")
    @Size(max = 500, message = "Option C cannot exceed 500 characters")
    @Column(length = 500)
    private String optionC;

    @NotBlank(message = "Option D is required")
    @Size(max = 500, message = "Option D cannot exceed 500 characters")
    @Column(length = 500)
    private String optionD;

    // Single letter: A, B, C, or D.
    @NotNull(message = "Correct option is required")
    @Pattern(regexp = "[ABCD]", message = "Correct option must be A, B, C, or D")
    @Column(length = 1)
    private String correctOption;

    @NotNull(message = "Difficulty is required")
    @Enumerated(EnumType.STRING)
    private Difficulty difficulty;

    @Size(max = 2000, message = "Explanation cannot exceed 2000 characters")
    @Column(length = 2000)
    private String explanation;

    public Question() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Topic getTopic() {
        return topic;
    }

    public void setTopic(Topic topic) {
        this.topic = topic;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getOptionA() {
        return optionA;
    }

    public void setOptionA(String optionA) {
        this.optionA = optionA;
    }

    public String getOptionB() {
        return optionB;
    }

    public void setOptionB(String optionB) {
        this.optionB = optionB;
    }

    public String getOptionC() {
        return optionC;
    }

    public void setOptionC(String optionC) {
        this.optionC = optionC;
    }

    public String getOptionD() {
        return optionD;
    }

    public void setOptionD(String optionD) {
        this.optionD = optionD;
    }

    public String getCorrectOption() {
        return correctOption;
    }

    public void setCorrectOption(String correctOption) {
        this.correctOption = correctOption;
    }

    public Difficulty getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(Difficulty difficulty) {
        this.difficulty = difficulty;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }
}
