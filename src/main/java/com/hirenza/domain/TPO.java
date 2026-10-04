package com.hirenza.domain;

import jakarta.persistence.*;

/*
Represents the Training and Placement Officer.
Converted to JPA entity.
*/
@Entity
@Table(name = "tpos")
public class TPO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(name = "is_verified", nullable = false)
    private boolean isVerified = false;
    
    @Column(name = "otp_requests_today", nullable = false)
    private int otpRequestsToday = 0;

    protected TPO() {}

    public TPO(String name, String email, String password) {
        this.name  = name;
        this.email = email;
        this.password = password;
        this.isVerified = false;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public boolean isVerified() { return isVerified; }
    public void setVerified(boolean verified) { this.isVerified = verified; }
    public int getOtpRequestsToday() { return otpRequestsToday; }
    public void incrementOtpRequests() { this.otpRequestsToday++; }
    public void resetOtpRequests() { this.otpRequestsToday = 0; }

    @Override
    public String toString() {
        return "TPO{name='" + name + "', email='" + email + "'}";
    }
}
