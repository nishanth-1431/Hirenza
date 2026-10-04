package com.hirenza.dto;

import java.time.LocalDate;

public class DriveResponse {
    private Long id;
    private String companyName;
    private String role;
    private LocalDate applicationDeadline;
    private EligibilityRuleDto eligibilityRules;
    
    // Additional fields for the student endpoint
    private boolean eligible;
    private String ineligibilityReason;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public LocalDate getApplicationDeadline() { return applicationDeadline; }
    public void setApplicationDeadline(LocalDate applicationDeadline) { this.applicationDeadline = applicationDeadline; }
    public EligibilityRuleDto getEligibilityRules() { return eligibilityRules; }
    public void setEligibilityRules(EligibilityRuleDto eligibilityRules) { this.eligibilityRules = eligibilityRules; }
    
    public boolean isEligible() { return eligible; }
    public void setEligible(boolean eligible) { this.eligible = eligible; }
    public String getIneligibilityReason() { return ineligibilityReason; }
    public void setIneligibilityReason(String ineligibilityReason) { this.ineligibilityReason = ineligibilityReason; }
}
