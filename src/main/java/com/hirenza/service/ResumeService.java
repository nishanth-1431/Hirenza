package com.hirenza.service;

import com.hirenza.domain.Resume;
import com.hirenza.domain.Skill;
import com.hirenza.domain.Student;
import com.hirenza.repository.ResumeRepository;
import com.hirenza.repository.SkillRepository;
import com.hirenza.repository.StudentRepository;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.embedding.EmbeddingResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final SkillRepository skillRepository;
    private final StudentRepository studentRepository;
    private final ChatClient chatClient;
    private final EmbeddingModel embeddingModel;

    public ResumeService(ResumeRepository resumeRepository,
                         SkillRepository skillRepository,
                         StudentRepository studentRepository,
                         ChatClient.Builder chatClientBuilder,
                         EmbeddingModel embeddingModel) {
        this.resumeRepository = resumeRepository;
        this.skillRepository = skillRepository;
        this.studentRepository = studentRepository;
        this.chatClient = chatClientBuilder.build();
        this.embeddingModel = embeddingModel;
    }

    @Transactional
    public Resume processAndSaveResume(Long studentId, String rawText) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));

        Resume resume = new Resume(student, rawText);

        // 1. Extract skills using LLM
        String systemPrompt = "You are an expert resume parser. Extract a comma-separated list of technical skills from the following resume text. Output ONLY the comma-separated list, nothing else.";
        String extractedSkillsText = "";
        try {
            extractedSkillsText = chatClient.prompt()
                    .system(systemPrompt)
                    .user(rawText)
                    .call()
                    .content();
        } catch (Exception e) {
            System.err.println("Failed to extract skills via Ollama: " + e.getMessage());
            // Fallback: we could use simple regex or leave it empty if Ollama is down
        }

        if (extractedSkillsText != null && !extractedSkillsText.isBlank()) {
            List<String> skillNames = Arrays.stream(extractedSkillsText.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .toList();

            for (String skillName : skillNames) {
                Skill skill = skillRepository.findByName(skillName)
                        .orElseGet(() -> skillRepository.save(new Skill(skillName)));
                resume.addSkill(skill);
            }
        }

        // 2. Generate embedding
        try {
            EmbeddingResponse embeddingResponse = embeddingModel.embedForResponse(List.of(rawText));
            float[] output = embeddingResponse.getResult().getOutput();
            List<Double> embeddingList = new java.util.ArrayList<>();
            for (float f : output) {
                embeddingList.add((double) f);
            }
            resume.setEmbedding(embeddingList);
        } catch (Exception e) {
            System.err.println("Failed to generate embedding via Ollama: " + e.getMessage());
        }

        return resumeRepository.save(resume);
    }
}
