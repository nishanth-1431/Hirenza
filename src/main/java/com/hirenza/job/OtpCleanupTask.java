package com.hirenza.job;

import com.hirenza.repository.OtpVerificationRepository;
import com.hirenza.repository.StudentRepository;
import com.hirenza.repository.TpoRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
public class OtpCleanupTask {

    private final OtpVerificationRepository otpRepository;
    private final StudentRepository studentRepository;
    private final TpoRepository tpoRepository;

    public OtpCleanupTask(OtpVerificationRepository otpRepository,
                          StudentRepository studentRepository,
                          TpoRepository tpoRepository) {
        this.otpRepository = otpRepository;
        this.studentRepository = studentRepository;
        this.tpoRepository = tpoRepository;
    }

    @Scheduled(cron = "0 0 0 * * ?") // Runs daily at midnight
    @Transactional
    public void purgeExpiredOtps() {
        otpRepository.deleteExpiredOtps(LocalDateTime.now());
        studentRepository.resetOtpRequests();
        tpoRepository.resetOtpRequests();
        System.out.println("Purged expired OTPs and reset rate limits at " + LocalDateTime.now());
    }
}
