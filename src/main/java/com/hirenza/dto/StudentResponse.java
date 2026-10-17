package com.hirenza.dto;

public class StudentResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private double cgpa;
    private String branch;
    private int arrearsCount;

    // Differentiating Feature Fields
    private String currentPlacedTier;
    private String placedCompanyName;
    private Double placedCtcLpa;
    private int goldenTicketsRemaining = 1;
    private Long goldenTicketDriveId;
    private String githubUrl;
    private boolean isCodeVerified;
    private String codeIntegrityBadge;
    private String blindCandidateCode;

    public StudentResponse() {}

    public StudentResponse(Long id, String name, String email, String phone, double cgpa, String branch, int arrearsCount) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.cgpa = cgpa;
        this.branch = branch;
        this.arrearsCount = arrearsCount;
        this.blindCandidateCode = "CANDIDATE-" + (id != null ? (800 + id) : 849);
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { 
        this.id = id; 
        this.blindCandidateCode = "CANDIDATE-" + (id != null ? (800 + id) : 849);
    }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public double getCgpa() { return cgpa; }
    public void setCgpa(double cgpa) { this.cgpa = cgpa; }
    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }
    public int getArrearsCount() { return arrearsCount; }
    public void setArrearsCount(int arrearsCount) { this.arrearsCount = arrearsCount; }

    public String getCurrentPlacedTier() { return currentPlacedTier; }
    public void setCurrentPlacedTier(String currentPlacedTier) { this.currentPlacedTier = currentPlacedTier; }
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
    public String getBlindCandidateCode() { return blindCandidateCode; }
    public void setBlindCandidateCode(String blindCandidateCode) { this.blindCandidateCode = blindCandidateCode; }
}
