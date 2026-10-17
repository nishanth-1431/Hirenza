package com.hirenza.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Represents an actionable post-interview debrief and autopsy.
 * Replaces the traditional "rejection black hole" with transparent rubric
 * feedback and targeted skill drills for the student's growth passport.
 */
@Entity
@Table(name = "interview_autopsies")
public class InterviewAutopsy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(nullable = false)
    private String role;

    @Column(name = "round_name", nullable = false)
    private String roundName;

    @Column(name = "percentile_rank")
    private int percentileRank = 75;

    @Column(nullable = false)
    private String outcome; // "CLEARED", "REJECTED", "ADVANCED"

    @Column(name = "strong_areas", length = 1000)
    private String strongAreas;

    @Column(name = "growth_areas", length = 1000)
    private String growthAreas;

    @Column(name = "actionable_advice", length = 2000)
    private String actionableAdvice;

    @Column(name = "recommended_drill", length = 1000)
    private String recommendedDrill;

    @Column(name = "evaluated_at", nullable = false)
    private LocalDateTime evaluatedAt = LocalDateTime.now();

    protected InterviewAutopsy() {}

    public InterviewAutopsy(Long studentId, String companyName, String role, String roundName,
                            int percentileRank, String outcome, String strongAreas,
                            String growthAreas, String actionableAdvice, String recommendedDrill) {
        this.studentId = studentId;
        this.companyName = companyName;
        this.role = role;
        this.roundName = roundName;
        this.percentileRank = percentileRank;
        this.outcome = outcome;
        this.strongAreas = strongAreas;
        this.growthAreas = growthAreas;
        this.actionableAdvice = actionableAdvice;
        this.recommendedDrill = recommendedDrill;
        this.evaluatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public Long getStudentId() { return studentId; }
    public String getCompanyName() { return companyName; }
    public String getRole() { return role; }
    public String getRoundName() { return roundName; }
    public int getPercentileRank() { return percentileRank; }
    public String getOutcome() { return outcome; }
    public String getStrongAreas() { return strongAreas; }
    public String getGrowthAreas() { return growthAreas; }
    public String getActionableAdvice() { return actionableAdvice; }
    public String getRecommendedDrill() { return recommendedDrill; }
    public LocalDateTime getEvaluatedAt() { return evaluatedAt; }
}
