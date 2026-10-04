CREATE TABLE skills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE resumes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    raw_text TEXT,
    uploaded_at TIMESTAMP NOT NULL,
    embedding JSON,
    CONSTRAINT fk_resumes_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

CREATE TABLE resume_skills (
    resume_id BIGINT NOT NULL,
    skill_id BIGINT NOT NULL,
    PRIMARY KEY (resume_id, skill_id),
    CONSTRAINT fk_rs_resume FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE,
    CONSTRAINT fk_rs_skill FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

CREATE TABLE drive_skills (
    drive_id BIGINT NOT NULL,
    skill_id BIGINT NOT NULL,
    PRIMARY KEY (drive_id, skill_id),
    CONSTRAINT fk_ds_drive FOREIGN KEY (drive_id) REFERENCES drives(id) ON DELETE CASCADE,
    CONSTRAINT fk_ds_skill FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

ALTER TABLE drives ADD COLUMN embedding JSON;
