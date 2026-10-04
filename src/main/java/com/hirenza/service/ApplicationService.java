package com.hirenza.service;

import com.hirenza.domain.Application;
import com.hirenza.domain.Drive;
import com.hirenza.domain.Student;
import com.hirenza.dto.ApplicationRequest;
import com.hirenza.dto.ApplicationResponse;
import com.hirenza.engine.EligibilityEvaluator;
import com.hirenza.engine.EligibilityResult;
import com.hirenza.repository.ApplicationRepository;
import com.hirenza.repository.DriveRepository;
import com.hirenza.repository.StudentRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.hirenza.event.ApplicationStatusChangedEvent;
import com.hirenza.domain.ApplicationStatus;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final StudentRepository studentRepository;
    private final DriveRepository driveRepository;
    private final EligibilityEvaluator eligibilityEvaluator;
    private final ApplicationEventPublisher eventPublisher;

    public ApplicationService(ApplicationRepository applicationRepository,
                              StudentRepository studentRepository,
                              DriveRepository driveRepository,
                              EligibilityEvaluator eligibilityEvaluator,
                              ApplicationEventPublisher eventPublisher) {
        this.applicationRepository = applicationRepository;
        this.studentRepository = studentRepository;
        this.driveRepository = driveRepository;
        this.eligibilityEvaluator = eligibilityEvaluator;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public ApplicationResponse applyForDrive(ApplicationRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));
        Drive drive = driveRepository.findById(request.getDriveId())
                .orElseThrow(() -> new RuntimeException("Drive not found"));

        // Use the EligibilityEvaluator to strictly enforce the rules before saving
        EligibilityResult result = eligibilityEvaluator.isEligible(student, drive);
        if (!result.isEligible()) {
            throw new RuntimeException("Cannot apply: " + result.getReason());
        }

        Application application = new Application(student, drive);
        application = applicationRepository.save(application);
        eventPublisher.publishEvent(new ApplicationStatusChangedEvent(application));
        
        
        ApplicationResponse response = new ApplicationResponse();
        response.setId(application.getId());
        response.setStudentId(student.getId());
        response.setStudentName(student.getName());
        response.setDriveId(drive.getId());
        response.setCompanyName(drive.getCompanyName());
        response.setStatus(application.getStatus().name());
        response.setAppliedAt(application.getAppliedAt());
        return response;
    }

    @Transactional
    public ApplicationResponse updateApplicationStatus(Long applicationId, ApplicationStatus status) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        app.updateStatus(status);
        app = applicationRepository.save(app);
        eventPublisher.publishEvent(new ApplicationStatusChangedEvent(app));

        ApplicationResponse response = new ApplicationResponse();
        response.setId(app.getId());
        response.setStatus(app.getStatus().name());
        return response;
    }
}
