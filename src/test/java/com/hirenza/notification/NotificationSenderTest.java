package com.hirenza.notification;

import com.hirenza.domain.Drive;
import com.hirenza.domain.Student;
import com.hirenza.engine.EligibilityEvaluator;
import com.hirenza.engine.EligibilityResult;
import com.hirenza.event.DriveCreatedEvent;
import com.hirenza.repository.StudentRepository;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.retry.annotation.EnableRetry;
import org.springframework.scheduling.annotation.EnableAsync;
import org.thymeleaf.TemplateEngine;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@SpringBootTest(classes = NotificationSenderTest.TestConfig.class)
public class NotificationSenderTest {

    @Configuration
    @EnableAsync
    @EnableRetry
    @Import({EmailNotificationSender.class}) // Only load the sender we want to test
    static class TestConfig {
        // Mock beans will be automatically added to this context by @MockBean below
    }

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    @MockBean
    private JavaMailSender mailSender;

    @MockBean
    private TemplateEngine templateEngine;

    @MockBean
    private StudentRepository studentRepository;

    @MockBean
    private EligibilityEvaluator eligibilityEvaluator;

    @BeforeEach
    void setup() {
        MimeMessage mimeMessage = Mockito.mock(MimeMessage.class);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        when(templateEngine.process(anyString(), any())).thenReturn("<html>Test</html>");
    }

    @Test
    void testNotifyOnlyEligibleStudents() {
        // Given
        Drive drive = Drive.builder()
                .companyName("Zoho")
                .role("SDE")
                .applicationDeadline(LocalDate.now().plusDays(10))
                .cgpaCutoff(7.0)
                .build();

        Student studentA = new Student("A", "a@test.com", "123", 8.0, "CSE", 0, "pass123");
        Student studentB = new Student("B", "b@test.com", "456", 6.5, "CSE", 0, "pass123");
        Student studentC = new Student("C", "c@test.com", "789", 8.0, "MECH", 0, "pass123");
        Student studentD = new Student("D", "d@test.com", "101", 8.0, "CSE", 2, "pass123");

        when(studentRepository.findAll()).thenReturn(List.of(studentA, studentB, studentC, studentD));

        when(eligibilityEvaluator.isEligible(studentA, drive)).thenReturn(EligibilityResult.eligible());
        when(eligibilityEvaluator.isEligible(studentB, drive)).thenReturn(EligibilityResult.ineligible("CGPA_CUTOFF", "Too low"));
        when(eligibilityEvaluator.isEligible(studentC, drive)).thenReturn(EligibilityResult.ineligible("BRANCH_NOT_ALLOWED", "Wrong branch"));
        when(eligibilityEvaluator.isEligible(studentD, drive)).thenReturn(EligibilityResult.ineligible("MAX_ARREARS", "Too many backlogs"));

        // When
        eventPublisher.publishEvent(new DriveCreatedEvent(drive));

        // Sleep briefly because events are processed asynchronously
        try { Thread.sleep(1000); } catch (InterruptedException e) {}

        // Then
        // Verify mailSender was ONLY called for Student A
        verify(mailSender, times(1)).send(any(MimeMessage.class));
        verify(eligibilityEvaluator, times(4)).isEligible(any(Student.class), eq(drive));
    }

    @Test
    void testSpringRetryAndAsyncFailureIsolation() {
        // Given
        Drive drive = Drive.builder()
                .companyName("Amazon")
                .role("SDE")
                .applicationDeadline(LocalDate.now().plusDays(10))
                .build();
        Student student = new Student("A", "a@test.com", "123", 8.0, "CSE", 0, "pass");

        when(studentRepository.findAll()).thenReturn(List.of(student));
        when(eligibilityEvaluator.isEligible(student, drive)).thenReturn(EligibilityResult.eligible());

        // Simulate 2 failures then 1 success
        doThrow(new RuntimeException("Network Error 1"))
        .doThrow(new RuntimeException("Network Error 2"))
        .doNothing()
        .when(mailSender).send(any(MimeMessage.class));

        // When
        eventPublisher.publishEvent(new DriveCreatedEvent(drive));

        // The retry has a 2000ms delay, and 4000ms on second retry. Total wait ~6s.
        try { Thread.sleep(7000); } catch (InterruptedException e) {}

        // Then
        verify(mailSender, times(3)).send(any(MimeMessage.class));
    }
}
