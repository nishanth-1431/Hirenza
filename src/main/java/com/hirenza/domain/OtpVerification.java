package com.hirenza.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/*
Stores OTPs for user verification.
Fits naturally in a relational DB since we just need to query by email and expires_at.
*/
@Entity
@Table(name = "otp_verifications")
public class OtpVerification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_email", nullable = false)
    private String userEmail;

    @Column(name = "otp_hash", nullable = false)
    private String otpHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OtpPurpose purpose;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "attempt_count", nullable = false)
    private int attemptCount = 0;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @Version
    private Long version;

    protected OtpVerification() {}

    public OtpVerification(String userEmail, String otpHash, OtpPurpose purpose, LocalDateTime expiresAt) {
        this.userEmail = userEmail;
        this.otpHash = otpHash;
        this.purpose = purpose;
        this.expiresAt = expiresAt;
    }

    public void incrementAttemptCount() {
        this.attemptCount++;
    }

    public void markVerified() {
        this.verifiedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getUserEmail() { return userEmail; }
    public String getOtpHash() { return otpHash; }
    public OtpPurpose getPurpose() { return purpose; }
    public LocalDateTime getExpiresAt() { return expiresAt; }
    public int getAttemptCount() { return attemptCount; }
    public LocalDateTime getVerifiedAt() { return verifiedAt; }
}
