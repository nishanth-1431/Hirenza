package com.hirenza.dto;

public class StudentResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private double cgpa;
    private String branch;
    private int arrearsCount;

    public StudentResponse() {}

    public StudentResponse(Long id, String name, String email, String phone, double cgpa, String branch, int arrearsCount) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.cgpa = cgpa;
        this.branch = branch;
        this.arrearsCount = arrearsCount;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
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
}
