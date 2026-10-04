package com.hirenza.service;

import com.hirenza.domain.OtpPurpose;
import com.hirenza.domain.OtpVerification;
import com.hirenza.domain.Student;
import com.hirenza.domain.TPO;
import com.hirenza.dto.LoginRequest;
import com.hirenza.dto.StudentRequest;
import com.hirenza.dto.VerifyOtpRequest;
import com.hirenza.repository.OtpVerificationRepository;
import com.hirenza.repository.StudentRepository;
import com.hirenza.repository.TpoRepository;
import com.hirenza.security.JwtUtil;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AuthService {

    private final StudentRepository studentRepository;
    private final TpoRepository tpoRepository;
    private final OtpVerificationRepository otpRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;
    private final JwtUtil jwtUtil;

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();
    private static final int MAX_DAILY_OTP = 3;

    public AuthService(StudentRepository studentRepository,
                       TpoRepository tpoRepository,
                       OtpVerificationRepository otpRepository,
                       PasswordEncoder passwordEncoder,
                       JavaMailSender mailSender,
                       JwtUtil jwtUtil) {
        this.studentRepository = studentRepository;
        this.tpoRepository = tpoRepository;
        this.otpRepository = otpRepository;
        this.passwordEncoder = passwordEncoder;
        this.mailSender = mailSender;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public void signupStudent(StudentRequest request) {
        if (studentRepository.findByEmail(request.getEmail()).isPresent() ||
            tpoRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        String hashedPassword = passwordEncoder.encode(request.getPassword());
        
        Student student = new Student(
                request.getName(), request.getEmail(), request.getPhone(),
                request.getCgpa(), request.getBranch(), request.getArrearsCount(),
                hashedPassword
        );
        studentRepository.save(student);

        generateAndSendOtp(student.getEmail());
    }

    @Transactional
    public void generateAndSendOtp(String email) {
        Student student = studentRepository.findByEmail(email).orElse(null);
        TPO tpo = tpoRepository.findByEmail(email).orElse(null);

        if (student == null && tpo == null) {
            throw new RuntimeException("User not found");
        }

        if (student != null) {
            if (student.getOtpRequestsToday() >= MAX_DAILY_OTP) throw new RuntimeException("Daily OTP limit reached");
            student.incrementOtpRequests();
            studentRepository.save(student);
        } else {
            if (tpo.getOtpRequestsToday() >= MAX_DAILY_OTP) throw new RuntimeException("Daily OTP limit reached");
            tpo.incrementOtpRequests();
            tpoRepository.save(tpo);
        }

        // Check cooldown
        Optional<OtpVerification> existing = otpRepository.findByUserEmailAndPurpose(email, OtpPurpose.SIGNUP);
        if (existing.isPresent()) {
            OtpVerification otp = existing.get();
            if (otp.getExpiresAt().minusMinutes(4).isAfter(LocalDateTime.now())) {
                throw new RuntimeException("Please wait 60 seconds before requesting a new OTP.");
            }
            otpRepository.delete(otp);
        }

        int rawOtp = 100000 + SECURE_RANDOM.nextInt(900000);
        String hashedOtp = passwordEncoder.encode(String.valueOf(rawOtp));

        OtpVerification otpVerification = new OtpVerification(
                email, hashedOtp, OtpPurpose.SIGNUP, LocalDateTime.now().plusMinutes(5)
        );
        otpRepository.save(otpVerification);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Your Hirenza Verification Code");
        message.setText("Your verification code is: " + rawOtp + "\nIt expires in 5 minutes.");
        mailSender.send(message);
    }

    @Transactional
    public String verifyOtp(VerifyOtpRequest request) {
        // Will throw ObjectOptimisticLockingFailureException on concurrent modifications
        OtpVerification otpRecord = otpRepository.findByUserEmailAndPurpose(request.getEmail(), OtpPurpose.SIGNUP)
                .orElseThrow(() -> new RuntimeException("No OTP found for this email"));

        if (otpRecord.getAttemptCount() >= 5) {
            throw new RuntimeException("Account locked due to too many failed OTP attempts. Request a new OTP.");
        }

        if (otpRecord.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }

        if (!passwordEncoder.matches(request.getOtp(), otpRecord.getOtpHash())) {
            otpRecord.incrementAttemptCount();
            otpRepository.save(otpRecord); // Version gets bumped here, locking out concurrent requests
            throw new RuntimeException("Invalid OTP");
        }

        Student student = studentRepository.findByEmail(request.getEmail()).orElse(null);
        TPO tpo = tpoRepository.findByEmail(request.getEmail()).orElse(null);

        String role = "";
        if (student != null) {
            student.setVerified(true);
            studentRepository.save(student);
            role = "STUDENT";
        } else if (tpo != null) {
            tpo.setVerified(true);
            tpoRepository.save(tpo);
            role = "TPO";
        }

        otpRepository.delete(otpRecord);
        return jwtUtil.generateToken(request.getEmail(), role);
    }

    public String login(LoginRequest request) {
        Student student = studentRepository.findByEmail(request.getEmail()).orElse(null);
        TPO tpo = tpoRepository.findByEmail(request.getEmail()).orElse(null);

        if (student == null && tpo == null) {
            throw new RuntimeException("Invalid credentials");
        }

        if (student != null) {
            if (!student.isVerified()) throw new RuntimeException("Account not verified.");
            if (!passwordEncoder.matches(request.getPassword(), student.getPassword())) throw new RuntimeException("Invalid credentials");
            return jwtUtil.generateToken(student.getEmail(), "STUDENT");
        } else {
            if (!tpo.isVerified()) throw new RuntimeException("Account not verified.");
            if (!passwordEncoder.matches(request.getPassword(), tpo.getPassword())) throw new RuntimeException("Invalid credentials");
            return jwtUtil.generateToken(tpo.getEmail(), "TPO");
        }
    }
}
