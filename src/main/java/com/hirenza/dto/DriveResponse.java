package com.hirenza.dto;

import java.time.LocalDate;

public class DriveResponse {
    private Long id;
    private String companyName;
    private String role;
    private LocalDate applicationDeadline;
    private Double ctc;
    private String tier;
    private EligibilityRuleDto eligibilityRules;
    
    // Additional fields for the student evaluation & What-If Pathfinder
    private boolean eligible;
    private String ineligibilityReason;
    private boolean tierLocked;
    private String tierLockReason;
    private String whatIfAdvice;
    private boolean waiverEligible;
    private boolean waiverApplied;
    private Integer goldenTicketsRemaining;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public LocalDate getApplicationDeadline() { return applicationDeadline; }
    public void setApplicationDeadline(LocalDate applicationDeadline) { this.applicationDeadline = applicationDeadline; }
    public Double getCtc() { return ctc; }
    public void setCtc(Double ctc) { this.ctc = ctc; }
    public String getTier() { return tier; }
    public void setTier(String tier) { this.tier = tier; }
    public EligibilityRuleDto getEligibilityRules() { return eligibilityRules; }
    public void setEligibilityRules(EligibilityRuleDto eligibilityRules) { this.eligibilityRules = eligibilityRules; }
    
    public boolean isEligible() { return eligible; }
    public void setEligible(boolean eligible) { this.eligible = eligible; }
    public String getIneligibilityReason() { return ineligibilityReason; }
    public void setIneligibilityReason(String ineligibilityReason) { this.ineligibilityReason = ineligibilityReason; }
    public boolean isTierLocked() { return tierLocked; }
    public void setTierLocked(boolean tierLocked) { this.tierLocked = tierLocked; }
    public String getTierLockReason() { return tierLockReason; }
    public void setTierLockReason(String tierLockReason) { this.tierLockReason = tierLockReason; }
    public String getWhatIfAdvice() { return whatIfAdvice; }
    public void setWhatIfAdvice(String whatIfAdvice) { this.whatIfAdvice = whatIfAdvice; }
    public boolean isWaiverEligible() { return waiverEligible; }
    public void setWaiverEligible(boolean waiverEligible) { this.waiverEligible = waiverEligible; }
    public boolean isWaiverApplied() { return waiverApplied; }
    public void setWaiverApplied(boolean waiverApplied) { this.waiverApplied = waiverApplied; }
    public Integer getGoldenTicketsRemaining() { return goldenTicketsRemaining; }
    public void setGoldenTicketsRemaining(Integer goldenTicketsRemaining) { this.goldenTicketsRemaining = goldenTicketsRemaining; }
}
