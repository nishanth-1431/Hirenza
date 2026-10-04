package com.hirenza.domain;

import jakarta.persistence.*;
import java.util.Collections;
import java.util.Set;

/*
Represents one eligibility rule for a drive.
Converted to a JPA entity in Phase 2.
*/
@Entity
@Table(name = "eligibility_rules")
public class EligibilityRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "drive_id", nullable = false)
    private Drive drive;

    @Enumerated(EnumType.STRING)
    @Column(name = "rule_type", nullable = false)
    private RuleType ruleType;

    @Column(name = "cgpa_cutoff")
    private Double cgpaCutoff;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "rule_allowed_branches", joinColumns = @JoinColumn(name = "rule_id"))
    @Column(name = "branch")
    private Set<String> allowedBranches;

    @Column(name = "max_arrears")
    private Integer maxArrears;

    protected EligibilityRule() {}

    private EligibilityRule(RuleType ruleType,
                            Double cgpaCutoff,
                            Set<String> allowedBranches,
                            Integer maxArrears) {
        this.ruleType        = ruleType;
        this.cgpaCutoff      = cgpaCutoff;
        this.allowedBranches = allowedBranches;
        this.maxArrears      = maxArrears;
    }

    public static EligibilityRule cgpaCutoff(double cutoff) {
        if (cutoff < 0 || cutoff > 10) {
            throw new IllegalArgumentException(
                "CGPA cutoff must be between 0 and 10, got: " + cutoff);
        }
        return new EligibilityRule(RuleType.CGPA_CUTOFF, cutoff, null, null);
    }

    public static EligibilityRule branchWhitelist(Set<String> branches) {
        if (branches == null || branches.isEmpty()) {
            throw new IllegalArgumentException("Branch whitelist must not be null or empty");
        }
        return new EligibilityRule(
            RuleType.BRANCH_WHITELIST, null, branches, null);
    }

    public static EligibilityRule maxArrears(int max) {
        if (max < 0) {
            throw new IllegalArgumentException(
                "Max arrears cannot be negative, got: " + max);
        }
        return new EligibilityRule(RuleType.MAX_ARREARS, null, null, max);
    }

    // Called internally by Drive to set both sides of the relationship
    public void setDrive(Drive drive) {
        this.drive = drive;
    }

    public Long getId() { return id; }
    public RuleType getRuleType() { return ruleType; }
    public Double getCgpaCutoff() { return cgpaCutoff; }
    public Set<String> getAllowedBranches() { 
        return allowedBranches != null ? Collections.unmodifiableSet(allowedBranches) : null; 
    }
    public Integer getMaxArrears() { return maxArrears; }

    @Override
    public String toString() {
        return switch (ruleType) {
            case CGPA_CUTOFF      -> "EligibilityRule[CGPA >= " + cgpaCutoff + "]";
            case BRANCH_WHITELIST -> "EligibilityRule[branch in " + allowedBranches + "]";
            case MAX_ARREARS      -> "EligibilityRule[arrears <= " + maxArrears + "]";
        };
    }
}
