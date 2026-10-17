package com.hirenza.domain;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/*
Represents a student in the system.
Converted to a JPA entity in Phase 2.
*/
@Entity
@Table(name = "students")
public class Student {

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
    
    private String phone;
    
    @Column(nullable = false)
    private double cgpa;
    
    @Column(nullable = false)
    private String branch;
    
    @Column(name = "arrears_count", nullable = false)
    private int arrearsCount;

    @Enumerated(EnumType.STRING)
    @Column(name = "current_placed_tier")
    private PlacementTier currentPlacedTier;

    @Column(name = "placed_company_name")
    private String placedCompanyName;

    @Column(name = "placed_ctc_lpa")
    private Double placedCtcLpa;

    @Column(name = "golden_tickets_remaining", nullable = false)
    private int goldenTicketsRemaining = 1;

    @Column(name = "golden_ticket_drive_id")
    private Long goldenTicketDriveId;

    @Column(name = "github_url")
    private String githubUrl;

    @Column(name = "is_code_verified", nullable = false)
    private boolean isCodeVerified = false;

    @Column(name = "code_integrity_badge")
    private String codeIntegrityBadge;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Application> applications = new ArrayList<>();

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Resume> resumes = new ArrayList<>();

    protected Student() {} // for JPA

    public Student(String name, String email, String phone, double cgpa, String branch, int arrearsCount) {
        this(name, email, phone, cgpa, branch, arrearsCount, "");
    }

    public Student(String name, String email, String phone, double cgpa, String branch, int arrearsCount, String password) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.cgpa = cgpa;
        this.branch = branch;
        this.arrearsCount = arrearsCount;
        this.password = password;
        this.isVerified = false;
        this.goldenTicketsRemaining = 1;
        this.isCodeVerified = false;
    }

    public void addApplication(Application application) {
        applications.add(application);
    }
    
    public void addResume(Resume resume) {
        resumes.add(resume);
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
    public void setPassword(String password) { this.password = password; }
    public String getPhone() { return phone; }
    public double getCgpa() { return cgpa; }
    public String getBranch() { return branch; }
    public int getArrearsCount() { return arrearsCount; }
    public List<Application> getApplications() { return applications; }
    public List<Resume> getResumes() { return resumes; }

    public PlacementTier getCurrentPlacedTier() { return currentPlacedTier; }
    public void setCurrentPlacedTier(PlacementTier currentPlacedTier) { this.currentPlacedTier = currentPlacedTier; }
    public String getPlacedCompanyName() { return placedCompanyName; }
    public void setPlacedCompanyName(String placedCompanyName) { this.placedCompanyName = placedCompanyName; }
    public Double getPlacedCtcLpa() { return placedCtcLpa; }
    public void setPlacedCtcLpa(Double placedCtcLpa) { this.placedCtcLpa = placedCtcLpa; }
    public int getGoldenTicketsRemaining() { return goldenTicketsRemaining; }
    public void setGoldenTicketsRemaining(int goldenTicketsRemaining) { this.goldenTicketsRemaining = goldenTicketsRemaining; }
    public Long getGoldenTicketDriveId() { return goldenTicketDriveId; }
    public void setGoldenTicketDriveId(Long goldenTicketDriveId) { this.goldenTicketDriveId = goldenTicketDriveId; }
    public String getGithubUrl() { return githubUrl; }
    public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }
    public boolean isCodeVerified() { return isCodeVerified; }
    public void setCodeVerified(boolean codeVerified) { isCodeVerified = codeVerified; }
    public String getCodeIntegrityBadge() { return codeIntegrityBadge; }
    public void setCodeIntegrityBadge(String codeIntegrityBadge) { this.codeIntegrityBadge = codeIntegrityBadge; }

    @Override
    public String toString() {
        return "Student{name='" + name + "', email='" + email +
               "', cgpa=" + cgpa + ", branch='" + branch +
               "', arrears=" + arrearsCount + "}";
    }
}
