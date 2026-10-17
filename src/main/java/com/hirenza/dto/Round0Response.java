package com.hirenza.dto;

import java.util.List;

public class Round0Response {
    private String sessionId;
    private String companyName;
    private int questionNumber;
    private int totalQuestions = 3;
    private String question;
    private String tip;
    
    // Feedback on previous question (if applicable)
    private Double score; // out of 10
    private String critique;
    private List<String> keyStrengths;
    private List<String> missedPoints;

    // Final outcome after question 3
    private boolean isFinished;
    private Double overallReadinessScore; // 0 - 100%
    private String readinessVerdict; // e.g. "STRONG_FIT", "NEEDS_REVISION"
    private String finalSummary;

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public int getQuestionNumber() { return questionNumber; }
    public void setQuestionNumber(int questionNumber) { this.questionNumber = questionNumber; }
    public int getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(int totalQuestions) { this.totalQuestions = totalQuestions; }
    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }
    public String getTip() { return tip; }
    public void setTip(String tip) { this.tip = tip; }
    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }
    public String getCritique() { return critique; }
    public void setCritique(String critique) { this.critique = critique; }
    public List<String> getKeyStrengths() { return keyStrengths; }
    public void setKeyStrengths(List<String> keyStrengths) { this.keyStrengths = keyStrengths; }
    public List<String> getMissedPoints() { return missedPoints; }
    public void setMissedPoints(List<String> missedPoints) { this.missedPoints = missedPoints; }
    public boolean isFinished() { return isFinished; }
    public void setFinished(boolean finished) { isFinished = finished; }
    public Double getOverallReadinessScore() { return overallReadinessScore; }
    public void setOverallReadinessScore(Double overallReadinessScore) { this.overallReadinessScore = overallReadinessScore; }
    public String getReadinessVerdict() { return readinessVerdict; }
    public void setReadinessVerdict(String readinessVerdict) { this.readinessVerdict = readinessVerdict; }
    public String getFinalSummary() { return finalSummary; }
    public void setFinalSummary(String finalSummary) { this.finalSummary = finalSummary; }
}
