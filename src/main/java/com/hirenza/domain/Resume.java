package com.hirenza.domain;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/*
A student's resume. 
Stores raw text from the parsed PDF and maps to extracted skills.
*/
@Entity
@Table(name = "resumes")
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "raw_text", columnDefinition = "TEXT")
    private String rawText;

    @Column(name = "uploaded_at", nullable = false)
    private LocalDateTime uploadedAt;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(name = "resume_skills",
            joinColumns = @JoinColumn(name = "resume_id"),
            inverseJoinColumns = @JoinColumn(name = "skill_id"))
    private Set<Skill> skills = new HashSet<>();

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "embedding", columnDefinition = "json")
    private List<Double> embedding;

    protected Resume() {}

    public Resume(Student student, String rawText) {
        this.student = student;
        this.rawText = rawText;
        this.uploadedAt = LocalDateTime.now();
    }
    
    public void addSkill(Skill skill) {
        skills.add(skill);
    }
    
    public void setEmbedding(List<Double> embedding) {
        this.embedding = embedding;
    }
    
    public Long getId() { return id; }
    public Student getStudent() { return student; }
    public String getRawText() { return rawText; }
    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public Set<Skill> getSkills() { return skills; }
    public List<Double> getEmbedding() { return embedding; }
}
