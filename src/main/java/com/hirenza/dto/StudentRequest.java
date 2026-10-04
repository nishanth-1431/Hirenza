package com.hirenza.dto;

public class StudentRequest {
    private String name;
    private String email;
    private String phone;
    private double cgpa;
    private String branch;
    private int arrearsCount;
    private String password;

    // Getters and setters
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
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
