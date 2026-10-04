package com.hirenza.dto;

public class ApplicationResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private Long driveId;
    private String companyName;
    private String status;
    private java.time.LocalDateTime appliedAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public Long getDriveId() { return driveId; }
    public void setDriveId(Long driveId) { this.driveId = driveId; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public java.time.LocalDateTime getAppliedAt() { return appliedAt; }
    public void setAppliedAt(java.time.LocalDateTime appliedAt) { this.appliedAt = appliedAt; }
}
