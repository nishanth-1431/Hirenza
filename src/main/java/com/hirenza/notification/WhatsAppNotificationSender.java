package com.hirenza.notification;

import com.hirenza.domain.Application;
import com.hirenza.domain.Drive;
import com.hirenza.domain.Student;
import com.hirenza.engine.EligibilityEvaluator;
import com.hirenza.event.ApplicationStatusChangedEvent;
import com.hirenza.event.DriveCreatedEvent;
import com.hirenza.repository.StudentRepository;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.EventListener;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class WhatsAppNotificationSender implements NotificationSender {

    private final StudentRepository studentRepository;
    private final EligibilityEvaluator eligibilityEvaluator;

    @Value("${TWILIO_ACCOUNT_SID:dummy_sid}")
    private String accountSid;

    @Value("${TWILIO_AUTH_TOKEN:dummy_token}")
    private String authToken;

    @Value("${TWILIO_SANDBOX_NUMBER:+14155238886}") // Default Twilio sandbox number
    private String sandboxNumber;

    public WhatsAppNotificationSender(StudentRepository studentRepository, EligibilityEvaluator eligibilityEvaluator) {
        this.studentRepository = studentRepository;
        this.eligibilityEvaluator = eligibilityEvaluator;
    }

    @PostConstruct
    public void init() {
        if (!"dummy_sid".equals(accountSid)) {
            Twilio.init(accountSid, authToken);
        }
    }

    @Override
    @Async
    @EventListener
    @Retryable(retryFor = {Exception.class}, maxAttempts = 3, backoff = @Backoff(delay = 2000, multiplier = 2))
    public void handleDriveCreated(DriveCreatedEvent event) {
        if ("dummy_sid".equals(accountSid)) return; // Skip if Twilio not configured

        Drive drive = event.getDrive();
        List<Student> students = studentRepository.findAll();

        for (Student student : students) {
            if (student.getPhone() != null && !student.getPhone().isEmpty() &&
                eligibilityEvaluator.isEligible(student, drive).isEligible()) {
                sendWhatsAppMessage(student, "New Placement Drive: " + drive.getCompanyName() + "\nRole: " + drive.getRole() + "\nDeadline: " + drive.getApplicationDeadline());
            }
        }
    }

    @Override
    @Async
    @EventListener
    @Retryable(retryFor = {Exception.class}, maxAttempts = 3, backoff = @Backoff(delay = 2000, multiplier = 2))
    public void handleApplicationStatusChanged(ApplicationStatusChangedEvent event) {
        if ("dummy_sid".equals(accountSid)) return; // Skip if Twilio not configured

        Application app = event.getApplication();
        Student student = app.getStudent();
        if (student.getPhone() != null && !student.getPhone().isEmpty()) {
            sendWhatsAppMessage(student, "Your application for " + app.getDrive().getCompanyName() + " has been updated to: " + app.getStatus());
        }
    }

    private void sendWhatsAppMessage(Student student, String body) {
        try {
            // Twilio Sandbox requires "whatsapp:" prefix
            String to = student.getPhone().startsWith("whatsapp:") ? student.getPhone() : "whatsapp:" + student.getPhone();
            String from = sandboxNumber.startsWith("whatsapp:") ? sandboxNumber : "whatsapp:" + sandboxNumber;

            Message message = Message.creator(
                    new PhoneNumber(to),
                    new PhoneNumber(from),
                    body
            ).create();
            System.out.println("WhatsApp sent to " + student.getPhone() + ", SID: " + message.getSid());
        } catch (Exception e) {
            throw new RuntimeException("Failed to send WhatsApp message", e);
        }
    }
}
