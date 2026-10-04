package com.hirenza.notification;

import com.hirenza.domain.Application;
import com.hirenza.domain.Drive;
import com.hirenza.domain.Student;
import com.hirenza.engine.EligibilityEvaluator;
import com.hirenza.event.ApplicationStatusChangedEvent;
import com.hirenza.event.DriveCreatedEvent;
import com.hirenza.repository.StudentRepository;
import org.springframework.context.event.EventListener;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.util.List;

@Component
public class EmailNotificationSender implements NotificationSender {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    private final StudentRepository studentRepository;
    private final EligibilityEvaluator eligibilityEvaluator;

    public EmailNotificationSender(JavaMailSender mailSender,
                                   TemplateEngine templateEngine,
                                   StudentRepository studentRepository,
                                   EligibilityEvaluator eligibilityEvaluator) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
        this.studentRepository = studentRepository;
        this.eligibilityEvaluator = eligibilityEvaluator;
    }

    @Override
    @Async
    @EventListener
    @Retryable(retryFor = {Exception.class}, maxAttempts = 3, backoff = @Backoff(delay = 2000, multiplier = 2))
    public void handleDriveCreated(DriveCreatedEvent event) {
        Drive drive = event.getDrive();
        List<Student> students = studentRepository.findAll();

        for (Student student : students) {
            if (eligibilityEvaluator.isEligible(student, drive).isEligible()) {
                sendDriveEmail(student, drive);
            }
        }
    }

    @Override
    @Async
    @EventListener
    @Retryable(retryFor = {Exception.class}, maxAttempts = 3, backoff = @Backoff(delay = 2000, multiplier = 2))
    public void handleApplicationStatusChanged(ApplicationStatusChangedEvent event) {
        Application app = event.getApplication();
        sendApplicationStatusEmail(app.getStudent(), app);
    }

    private void sendDriveEmail(Student student, Drive drive) {
        try {
            Context context = new Context();
            context.setVariable("studentName", student.getName());
            context.setVariable("companyName", drive.getCompanyName());
            context.setVariable("role", drive.getRole());
            context.setVariable("deadline", drive.getApplicationDeadline().toString());

            String process = templateEngine.process("drive-notification", context);
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(student.getEmail());
            helper.setSubject("New Placement Drive: " + drive.getCompanyName());
            helper.setText(process, true);

            mailSender.send(mimeMessage);
            System.out.println("Email sent to " + student.getEmail() + " for drive " + drive.getCompanyName());
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }

    private void sendApplicationStatusEmail(Student student, Application app) {
        try {
            Context context = new Context();
            context.setVariable("studentName", student.getName());
            context.setVariable("companyName", app.getDrive().getCompanyName());
            context.setVariable("status", app.getStatus().name());

            String process = templateEngine.process("status-notification", context);
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(student.getEmail());
            helper.setSubject("Application Status Update: " + app.getDrive().getCompanyName());
            helper.setText(process, true);

            mailSender.send(mimeMessage);
            System.out.println("Status email sent to " + student.getEmail() + " for " + app.getDrive().getCompanyName());
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }
}
