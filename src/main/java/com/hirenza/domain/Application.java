package com.hirenza.domain;

import jakarta.persistence.*;

/*
Links a student to a drive they applied for.
Added JPA mappings. The unique constraint prevents double-applying.
*/
@Entity
@Table(name = "applications", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"student_id", "drive_id"})
})
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "drive_id", nullable = false)
    private Drive drive;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status;

    @Column(name = "applied_at", nullable = false)
    private java.time.LocalDateTime appliedAt;

    protected Application() {}

    public Application(Student student, Drive drive) {
        this.student   = student;
        this.drive     = drive;
        this.status    = ApplicationStatus.APPLIED;
        this.appliedAt = java.time.LocalDateTime.now();
    }

    /* Called by the TPO when moving the application to the next stage. */
    public void updateStatus(ApplicationStatus newStatus) {
        this.status = newStatus;
    }

    public Long getId() { return id; }
    public Student getStudent()  { return student; }
    public Drive getDrive()    { return drive; }
    public ApplicationStatus getStatus()   { return status; }
    public java.time.LocalDateTime getAppliedAt(){ return appliedAt; }

    @Override
    public String toString() {
        return "Application{student='" + student.getName() +
               "', drive='" + drive.getCompanyName() +
               "', status=" + status + "}";
    }
}
