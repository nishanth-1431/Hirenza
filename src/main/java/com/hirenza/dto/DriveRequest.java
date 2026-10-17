package com.hirenza.dto;

import java.time.LocalDate;

public class DriveRequest {
    private String companyName;
    private String role;
    private LocalDate applicationDeadline;
    private String jobDescription;
    private Double ctc;
    private String tier;
    private EligibilityRuleDto eligibilityRules;

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public LocalDate getApplicationDeadline() { return applicationDeadline; }
    public void setApplicationDeadline(LocalDate applicationDeadline) { this.applicationDeadline = applicationDeadline; }
    public String getJobDescription() { return jobDescription; }
    public void setJobDescription(String jobDescription) { this.jobDescription = jobDescription; }
    public Double getCtc() { return ctc; }
    public void setCtc(Double ctc) { this.ctc = ctc; }
    public String getTier() { return tier; }
    public void setTier(String tier) { this.tier = tier; }
    public EligibilityRuleDto getEligibilityRules() { return eligibilityRules; }
    public void setEligibilityRules(EligibilityRuleDto eligibilityRules) { this.eligibilityRules = eligibilityRules; }
}
