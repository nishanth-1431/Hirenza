package com.hirenza.service;

import com.hirenza.domain.Drive;
import com.hirenza.domain.Student;
import com.hirenza.dto.DriveRequest;
import com.hirenza.dto.DriveResponse;
import com.hirenza.dto.EligibilityRuleDto;
import com.hirenza.engine.EligibilityEvaluator;
import com.hirenza.engine.EligibilityResult;
import com.hirenza.mapper.DriveMapper;
import com.hirenza.repository.DriveRepository;
import com.hirenza.repository.SkillRepository;
import com.hirenza.repository.StudentRepository;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.embedding.EmbeddingResponse;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.hirenza.event.DriveCreatedEvent;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DriveService {

    private final DriveRepository driveRepository;
    private final StudentRepository studentRepository;
    private final SkillRepository skillRepository;
    private final EligibilityEvaluator eligibilityEvaluator;
    private final ApplicationEventPublisher eventPublisher;
    private final ChatClient chatClient;
    private final EmbeddingModel embeddingModel;

    public DriveService(DriveRepository driveRepository,
                        StudentRepository studentRepository,
                        SkillRepository skillRepository,
                        EligibilityEvaluator eligibilityEvaluator,
                        ApplicationEventPublisher eventPublisher,
                        ChatClient.Builder chatClientBuilder,
                        EmbeddingModel embeddingModel) {
        this.driveRepository = driveRepository;
        this.studentRepository = studentRepository;
        this.skillRepository = skillRepository;
        this.eligibilityEvaluator = eligibilityEvaluator;
        this.eventPublisher = eventPublisher;
        this.chatClient = chatClientBuilder.build();
        this.embeddingModel = embeddingModel;
    }

    @Transactional
    public DriveResponse createDrive(DriveRequest request) {
        Drive.Builder builder = Drive.builder()
                .companyName(request.getCompanyName())
                .role(request.getRole())
                .applicationDeadline(request.getApplicationDeadline());
                
        EligibilityRuleDto rules = request.getEligibilityRules();
        if (rules != null) {
            if (rules.getCgpaCutoff() != null) builder.cgpaCutoff(rules.getCgpaCutoff());
            if (rules.getAllowedBranches() != null) builder.allowedBranches(rules.getAllowedBranches());
            if (rules.getMaxArrears() != null) builder.maxArrears(rules.getMaxArrears());
        }

        Drive drive = builder.build();

        if (request.getJobDescription() != null && !request.getJobDescription().isBlank()) {
            String systemPrompt = "You are an HR expert. Extract a comma-separated list of technical skills from the following job description. Output ONLY the comma-separated list, nothing else.";
            try {
                String extractedSkills = chatClient.prompt()
                        .system(systemPrompt)
                        .user(request.getJobDescription())
                        .call()
                        .content();
                        
                if (extractedSkills != null && !extractedSkills.isBlank()) {
                    List<String> skillNames = Arrays.stream(extractedSkills.split(","))
                            .map(String::trim)
                            .filter(s -> !s.isEmpty())
                            .toList();
        
                    for (String skillName : skillNames) {
                        com.hirenza.domain.Skill skill = skillRepository.findByName(skillName)
                                .orElseGet(() -> skillRepository.save(new com.hirenza.domain.Skill(skillName)));
                        drive.addRequiredSkill(skill);
                    }
                }
            } catch (Exception e) {
                System.err.println("Failed to extract skills via Ollama: " + e.getMessage());
            }

            try {
                EmbeddingResponse embeddingResponse = embeddingModel.embedForResponse(List.of(request.getJobDescription()));
                float[] output = embeddingResponse.getResult().getOutput();
                List<Double> embeddingList = new java.util.ArrayList<>();
                for (float f : output) {
                    embeddingList.add((double) f);
                }
                drive.setEmbedding(embeddingList);
            } catch (Exception e) {
                System.err.println("Failed to generate embedding via Ollama: " + e.getMessage());
            }
        }

        drive = driveRepository.save(drive);
        eventPublisher.publishEvent(new DriveCreatedEvent(drive));
        return DriveMapper.toResponse(drive);
    }

    public List<DriveResponse> getAllDrives() {
        return driveRepository.findAll().stream()
                .map(DriveMapper::toResponse)
                .collect(Collectors.toList());
    }

    // Endpoint for finding eligible drives for a student
    @Transactional(readOnly = true)
    public List<DriveResponse> getEligibleDrives(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        return driveRepository.findAll().stream()
                .map(drive -> {
                    EligibilityResult result = eligibilityEvaluator.isEligible(student, drive);
                    DriveResponse response = DriveMapper.toResponse(drive);
                    response.setEligible(result.isEligible());
                    if (!result.isEligible()) {
                        response.setIneligibilityReason(result.getReason());
                    }
                    return response;
                })
                .filter(DriveResponse::isEligible)
                .collect(Collectors.toList());
    }
}
