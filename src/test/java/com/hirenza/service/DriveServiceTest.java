package com.hirenza.service;

import com.hirenza.domain.Drive;
import com.hirenza.domain.EligibilityRule;
import com.hirenza.domain.RuleType;
import com.hirenza.domain.Student;
import com.hirenza.dto.DriveResponse;
import com.hirenza.engine.EligibilityEvaluator;
import com.hirenza.engine.EligibilityResult;
import com.hirenza.repository.DriveRepository;
import com.hirenza.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.context.ApplicationEventPublisher;
import com.hirenza.repository.SkillRepository;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

public class DriveServiceTest {

    private DriveRepository driveRepository;
    private StudentRepository studentRepository;
    private EligibilityEvaluator eligibilityEvaluator;
    private ApplicationEventPublisher eventPublisher;
    private DriveService driveService;
    private SkillRepository skillRepository;
    private ChatClient.Builder chatClientBuilder;
    private EmbeddingModel embeddingModel;

    @BeforeEach
    void setup() {
        driveRepository = Mockito.mock(DriveRepository.class);
        studentRepository = Mockito.mock(StudentRepository.class);
        eligibilityEvaluator = Mockito.mock(EligibilityEvaluator.class);
        eventPublisher = Mockito.mock(ApplicationEventPublisher.class);
        skillRepository = Mockito.mock(SkillRepository.class);
        chatClientBuilder = Mockito.mock(ChatClient.Builder.class);
        embeddingModel = Mockito.mock(EmbeddingModel.class);
        
        ChatClient chatClient = Mockito.mock(ChatClient.class);
        when(chatClientBuilder.build()).thenReturn(chatClient);
        
        driveService = new DriveService(driveRepository, studentRepository, skillRepository, eligibilityEvaluator, eventPublisher, chatClientBuilder, embeddingModel);
    }

    @Test
    void testGetEligibleDrives_FiltersOutIneligible() {
        // Given
        Student student = new Student("Nishanth", "test@test.com", "123", 8.0, "CSE", 0, "pass123");
        
        Drive zoho = Drive.builder().companyName("Zoho").role("Dev").applicationDeadline(LocalDate.now()).build();
        Drive amazon = Drive.builder().companyName("Amazon").role("Dev").applicationDeadline(LocalDate.now()).build();

        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(driveRepository.findAll()).thenReturn(List.of(zoho, amazon));

        // Zoho is eligible
        when(eligibilityEvaluator.isEligible(student, zoho))
                .thenReturn(EligibilityResult.eligible());
        
        // Amazon is ineligible
        when(eligibilityEvaluator.isEligible(student, amazon))
                .thenReturn(EligibilityResult.ineligible("CGPA_CUTOFF", "Below cutoff"));

        // When
        List<DriveResponse> result = driveService.getEligibleDrives(1L);

        // Then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getCompanyName()).isEqualTo("Zoho");
        assertThat(result.get(0).isEligible()).isTrue();
    }
}
