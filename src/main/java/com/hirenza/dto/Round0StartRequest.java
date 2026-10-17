package com.hirenza.dto;

public class Round0StartRequest {
    private Long studentId;
    private Long driveId;
    private String roundType; // TECHNICAL, SYSTEM_DESIGN, HR

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public Long getDriveId() { return driveId; }
    public void setDriveId(Long driveId) { this.driveId = driveId; }
    public String getRoundType() { return roundType; }
    public void setRoundType(String roundType) { this.roundType = roundType; }
}
