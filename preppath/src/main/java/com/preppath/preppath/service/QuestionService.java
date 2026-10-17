package com.preppath.preppath.service;

import com.preppath.preppath.entity.Question;
import com.preppath.preppath.entity.Topic;
import com.preppath.preppath.repository.QuestionRepository;
import com.preppath.preppath.repository.TopicRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final TopicRepository topicRepository;

    public QuestionService(QuestionRepository questionRepository,
                           TopicRepository topicRepository) {
        this.questionRepository = questionRepository;
        this.topicRepository = topicRepository;
    }

    public Question create(Long topicId, Question question) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new RuntimeException("Topic not found"));

        question.setId(null); // prevent client from dictating the PK
        question.setTopic(topic);
        return questionRepository.save(question);
    }

    public List<Question> getAllByTopic(Long topicId) {
        topicRepository.findById(topicId)
                .orElseThrow(() -> new RuntimeException("Topic not found"));
        return questionRepository.findByTopicId(topicId);
    }

    public Optional<Question> getById(Long topicId, Long questionId) {
        // Only return the question if it actually belongs to the requested topic.
        return questionRepository.findById(questionId)
                .filter(q -> q.getTopic().getId().equals(topicId));
    }

    public Question update(Long topicId, Long questionId, Question updatedQuestion) {
        topicRepository.findById(topicId)
                .orElseThrow(() -> new RuntimeException("Topic not found"));

        Question existing = questionRepository.findById(questionId)
                .filter(q -> q.getTopic().getId().equals(topicId))
                .orElseThrow(() -> new RuntimeException("Question not found"));

        existing.setText(updatedQuestion.getText());
        existing.setOptionA(updatedQuestion.getOptionA());
        existing.setOptionB(updatedQuestion.getOptionB());
        existing.setOptionC(updatedQuestion.getOptionC());
        existing.setOptionD(updatedQuestion.getOptionD());
        existing.setCorrectOption(updatedQuestion.getCorrectOption());
        existing.setDifficulty(updatedQuestion.getDifficulty());
        existing.setExplanation(updatedQuestion.getExplanation());

        return questionRepository.save(existing);
    }

    public void delete(Long topicId, Long questionId) {
        questionRepository.findById(questionId)
                .filter(q -> q.getTopic().getId().equals(topicId))
                .orElseThrow(() -> new RuntimeException("Question not found"));

        questionRepository.deleteById(questionId);
    }
}
