CREATE TABLE students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    cgpa DOUBLE NOT NULL,
    branch VARCHAR(50) NOT NULL,
    arrears_count INT NOT NULL DEFAULT 0
);

CREATE TABLE resumes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    raw_text TEXT,
    uploaded_at DATETIME NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id)
);

CREATE TABLE skills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE resume_skills (
    resume_id BIGINT NOT NULL,
    skill_id BIGINT NOT NULL,
    PRIMARY KEY (resume_id, skill_id),
    FOREIGN KEY (resume_id) REFERENCES resumes(id),
    FOREIGN KEY (skill_id) REFERENCES skills(id)
);

CREATE TABLE drives (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    application_deadline DATE NOT NULL
);

CREATE TABLE eligibility_rules (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    drive_id BIGINT NOT NULL,
    rule_type VARCHAR(50) NOT NULL,
    cgpa_cutoff DOUBLE,
    max_arrears INT,
    FOREIGN KEY (drive_id) REFERENCES drives(id) ON DELETE CASCADE
);

CREATE TABLE rule_allowed_branches (
    rule_id BIGINT NOT NULL,
    branch VARCHAR(50) NOT NULL,
    FOREIGN KEY (rule_id) REFERENCES eligibility_rules(id) ON DELETE CASCADE
);

CREATE TABLE applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    drive_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL,
    applied_at DATETIME NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (drive_id) REFERENCES drives(id),
    UNIQUE (student_id, drive_id)
);
-- We query applications by drive to show the TPO list
CREATE INDEX idx_applications_drive_id ON applications(drive_id);

CREATE TABLE tpos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE otp_verifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    otp_hash VARCHAR(255) NOT NULL,
    purpose VARCHAR(50) NOT NULL,
    expires_at DATETIME NOT NULL,
    attempt_count INT NOT NULL DEFAULT 0,
    verified_at DATETIME
);
-- We query OTPs by email to verify, and by expires_at to purge old ones
CREATE INDEX idx_otp_email ON otp_verifications(user_email);
CREATE INDEX idx_otp_expires ON otp_verifications(expires_at);
