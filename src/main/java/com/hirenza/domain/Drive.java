package com.hirenza.domain;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/*
Represents a placement drive that a company posts through the TPO.
Converted to JPA entity with a OneToMany to EligibilityRule.
*/
@Entity
@Table(name = "drives")
public class Drive {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "company_name", nullable = false)
    private String companyName;
    
    @Column(nullable = false)
    private String role;
    
    @Column(name = "application_deadline", nullable = false)
    private LocalDate applicationDeadline;

    @OneToMany(mappedBy = "drive", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EligibilityRule> eligibilityRules = new ArrayList<>();

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(name = "drive_skills",
            joinColumns = @JoinColumn(name = "drive_id"),
            inverseJoinColumns = @JoinColumn(name = "skill_id"))
    private Set<Skill> requiredSkills = new HashSet<>();

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "embedding", columnDefinition = "json")
    private List<Double> embedding;

    protected Drive() {}

    private Drive(Builder builder) {
        this.companyName         = builder.companyName;
        this.role                = builder.role;
        this.applicationDeadline = builder.applicationDeadline;

        if (builder.cgpaCutoff != null) {
            addEligibilityRule(EligibilityRule.cgpaCutoff(builder.cgpaCutoff));
        }
        if (builder.allowedBranches != null && !builder.allowedBranches.isEmpty()) {
            addEligibilityRule(EligibilityRule.branchWhitelist(builder.allowedBranches));
        }
        if (builder.maxArrears != null) {
            addEligibilityRule(EligibilityRule.maxArrears(builder.maxArrears));
        }
    }

    private void addEligibilityRule(EligibilityRule rule) {
        rule.setDrive(this);
        eligibilityRules.add(rule);
    }
    
    public void addRequiredSkill(Skill skill) {
        requiredSkills.add(skill);
    }
    
    public void setEmbedding(List<Double> embedding) {
        this.embedding = embedding;
    }

    public Long getId() { return id; }
    public String getCompanyName() { return companyName; }
    public String getRole() { return role; }
    public LocalDate getApplicationDeadline() { return applicationDeadline; }
    public List<EligibilityRule> getEligibilityRules() { return Collections.unmodifiableList(eligibilityRules); }
    public Set<Skill> getRequiredSkills() { return requiredSkills; }
    public List<Double> getEmbedding() { return embedding; }

    @Override
    public String toString() {
        return "Drive{company='" + companyName + "', role='" + role +
               "', deadline=" + applicationDeadline + "}";
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {

        private String      companyName;
        private String      role;
        private LocalDate   applicationDeadline;
        private Double      cgpaCutoff;
        private Set<String> allowedBranches;
        private Integer     maxArrears;

        public Builder companyName(String companyName) {
            this.companyName = companyName;
            return this;
        }

        public Builder role(String role) {
            this.role = role;
            return this;
        }

        public Builder applicationDeadline(LocalDate deadline) {
            this.applicationDeadline = deadline;
            return this;
        }

        public Builder cgpaCutoff(double cutoff) {
            this.cgpaCutoff = cutoff;
            return this;
        }

        public Builder allowedBranches(Set<String> branches) {
            this.allowedBranches = branches;
            return this;
        }

        public Builder maxArrears(int max) {
            this.maxArrears = max;
            return this;
        }

        public Drive build() {
            if (companyName == null || companyName.isBlank()) {
                throw new IllegalStateException("Drive must have a company name");
            }
            if (role == null || role.isBlank()) {
                throw new IllegalStateException("Drive must have a role");
            }
            return new Drive(this);
        }
    }
}
