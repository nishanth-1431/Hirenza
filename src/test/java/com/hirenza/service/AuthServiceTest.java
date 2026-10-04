package com.hirenza.service;

import com.hirenza.domain.OtpPurpose;
import com.hirenza.domain.OtpVerification;
import com.hirenza.domain.Student;
import com.hirenza.dto.LoginRequest;
import com.hirenza.dto.StudentRequest;
import com.hirenza.dto.VerifyOtpRequest;
import com.hirenza.repository.OtpVerificationRepository;
import com.hirenza.repository.StudentRepository;
import com.hirenza.repository.TpoRepository;
import com.hirenza.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class AuthServiceTest {

    private StudentRepository studentRepository;
    private TpoRepository tpoRepository;
    private OtpVerificationRepository otpRepository;
    private PasswordEncoder passwordEncoder;
    private JavaMailSender mailSender;
    private JwtUtil jwtUtil;
    private AuthService authService;

    @BeforeEach
    void setup() {
        studentRepository = mock(StudentRepository.class);
        tpoRepository = mock(TpoRepository.class);
        otpRepository = mock(OtpVerificationRepository.class);
        passwordEncoder = new BCryptPasswordEncoder(); // Real encoder for testing hashes
        mailSender = mock(JavaMailSender.class);
        jwtUtil = mock(JwtUtil.class);
        authService = new AuthService(studentRepository, tpoRepository, otpRepository, passwordEncoder, mailSender, jwtUtil);
    }

    @Test
    void testSignup_hashesPasswordAndOtp() {
        StudentRequest req = new StudentRequest();
        req.setEmail("test@test.com");
        req.setPassword("myPassword123");
        req.setName("Test");
        req.setCgpa(8.0);

        // Stub the findByEmail call: first empty (for unique check), then the student (for OTP generation)
        Student studentToSave = new Student("Test", "test@test.com", "123", 8.0, "CSE", 0, "hash");
        when(studentRepository.findByEmail("test@test.com"))
            .thenReturn(Optional.empty())
            .thenReturn(Optional.of(studentToSave));

        // When
        authService.signupStudent(req);

        // Then Password is Hashed
        ArgumentCaptor<Student> studentCaptor = ArgumentCaptor.forClass(Student.class);
        verify(studentRepository, times(2)).save(studentCaptor.capture());
        Student savedStudent = studentCaptor.getAllValues().get(0);
        assertThat(passwordEncoder.matches("myPassword123", savedStudent.getPassword())).isTrue();
        assertThat(savedStudent.isVerified()).isFalse();

        // Then OTP is Hashed
        ArgumentCaptor<OtpVerification> otpCaptor = ArgumentCaptor.forClass(OtpVerification.class);
        verify(otpRepository).save(otpCaptor.capture());
        OtpVerification savedOtp = otpCaptor.getValue();
        // Since we don't know the exact OTP generated, we verify that the mail was sent
        ArgumentCaptor<SimpleMailMessage> mailCaptor = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender).send(mailCaptor.capture());
        String text = mailCaptor.getValue().getText();
        String rawOtp = text.substring(text.indexOf(": ") + 2, text.indexOf("\n")).trim();
        assertThat(passwordEncoder.matches(rawOtp, savedOtp.getOtpHash())).isTrue();
        assertThat(passwordEncoder.matches(rawOtp, savedOtp.getOtpHash())).isTrue();
    }

    @Test
    void testRateLimitAndCooldown() {
        Student student = new Student("Test", "test@test.com", "123", 8.0, "CSE", 0, "hash");
        when(studentRepository.findByEmail("test@test.com")).thenReturn(Optional.of(student));

        // Setup existing OTP just requested 1 min ago
        OtpVerification recentOtp = new OtpVerification("test@test.com", "hash", OtpPurpose.SIGNUP, LocalDateTime.now().plusMinutes(5));
        when(otpRepository.findByUserEmailAndPurpose("test@test.com", OtpPurpose.SIGNUP)).thenReturn(Optional.of(recentOtp));

        assertThatThrownBy(() -> authService.generateAndSendOtp("test@test.com"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("60 seconds");

        // Now test 3 attempts daily limit
        student.incrementOtpRequests();
        student.incrementOtpRequests();
        student.incrementOtpRequests(); // Now 3 requests today

        assertThatThrownBy(() -> authService.generateAndSendOtp("test@test.com"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Daily OTP limit reached");
    }

    @Test
    void testVerifyOtp_wrongOtpIncrementsAttempts() {
        String rawOtp = "123456";
        String hashedOtp = passwordEncoder.encode(rawOtp);
        OtpVerification otpRecord = new OtpVerification("test@test.com", hashedOtp, OtpPurpose.SIGNUP, LocalDateTime.now().plusMinutes(5));

        when(otpRepository.findByUserEmailAndPurpose("test@test.com", OtpPurpose.SIGNUP))
                .thenReturn(Optional.of(otpRecord));

        VerifyOtpRequest req = new VerifyOtpRequest();
        req.setEmail("test@test.com");
        req.setOtp("999999"); // Wrong OTP

        assertThatThrownBy(() -> authService.verifyOtp(req))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Invalid OTP");

        assertThat(otpRecord.getAttemptCount()).isEqualTo(1);
        verify(otpRepository).save(otpRecord); // Ensure save is called for version bump
    }

    @Test
    void testVerifyOtp_5FailuresBlocked() {
        OtpVerification otpRecord = new OtpVerification("test@test.com", "hash", OtpPurpose.SIGNUP, LocalDateTime.now().plusMinutes(5));
        for(int i=0; i<5; i++) otpRecord.incrementAttemptCount(); // Set to 5

        when(otpRepository.findByUserEmailAndPurpose("test@test.com", OtpPurpose.SIGNUP))
                .thenReturn(Optional.of(otpRecord));

        VerifyOtpRequest req = new VerifyOtpRequest();
        req.setEmail("test@test.com");
        req.setOtp("123456");

        assertThatThrownBy(() -> authService.verifyOtp(req))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("locked");
    }

    @Test
    void testVerifyOtp_expiredBlocked() {
        OtpVerification otpRecord = new OtpVerification("test@test.com", "hash", OtpPurpose.SIGNUP, LocalDateTime.now().minusMinutes(1)); // Expired

        when(otpRepository.findByUserEmailAndPurpose("test@test.com", OtpPurpose.SIGNUP))
                .thenReturn(Optional.of(otpRecord));

        VerifyOtpRequest req = new VerifyOtpRequest();
        req.setEmail("test@test.com");
        req.setOtp("123456");

        assertThatThrownBy(() -> authService.verifyOtp(req))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("expired");
    }

    @Test
    void testLogin_unverifiedAccountRejected() {
        Student student = new Student("Test", "test@test.com", "123", 8.0, "CSE", 0, "hash");
        student.setVerified(false);
        when(studentRepository.findByEmail("test@test.com")).thenReturn(Optional.of(student));

        LoginRequest req = new LoginRequest();
        req.setEmail("test@test.com");
        req.setPassword("pass");

        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Account not verified");
    }
}
