# Hirenza — Enterprise Campus Recruitment & Placement Automation Platform
### Master Architecture & Multi-Phase Enterprise Roadmap

> **Target Profile**: Enterprise-grade Full-Stack Software Engineering (Java 17 / 21, Spring Boot 3, React 18, MySQL 8, Spring AI, Docker, Jenkins/CI-CD). Built to mirror real-world SaaS architectures at tier-1 product companies (Zoho, Freshworks, Oracle).

---

## 1. Executive Summary & Enterprise Vision

**Hirenza** (DriveTrack) is a high-throughput, secure, multi-tenant campus placement orchestration platform designed to replace fragmented legacy workflows (WhatsApp announcements, noticeboard PDFs, manual spreadsheet cross-checks) with an automated, rule-driven recruitment engine.

### Core Value Drivers:
1. **Deterministic Rule Engine**: High-precision evaluation of dynamic eligibility rules (CGPA cutoffs, standing arrears, history of backlogs, branch whitelists) with zero manual cross-verification.
2. **Tri-Party RBAC Orchestration**: Unified ecosystem for **Students**, **Company HR/Recruiters**, and the **TPO (Training & Placement Officer) Cell**.
3. **Multi-Stage Round Progression**: End-to-end interview round lifecycle tracking (Aptitude -> Technical 1 -> Technical 2 -> HR -> Offer Letter) with instant student visibility.
4. **Resilient Event-Driven Communications**: Asynchronous multi-channel notifications (JavaMailSender/Brevo for Email, Twilio for WhatsApp, WebSocket/STOMP for in-app push alerts).
5. **AI Semantic Matching**: DeepSeek/Ollama local LLM skill extraction paired with MySQL-native vector embeddings for contextual resume-to-job matching.
6. **Enterprise Security & Compliance**: BCrypt-hashed OTP authentication (login, verification, password recovery), brute-force lockout, rate limiting, and RFC 7807 standard error reporting.

---

## 2. High-Level Enterprise Architecture

```
                          ┌────────────────────────────────────────────────────────┐
                          │                     FRONTEND TIER                      │
                          │   React 18 + Vite + Tailwind CSS + Framer Motion       │
                          │   - Student Portal  - HR Recruiter Hub  - TPO Command  │
                          └──────────────────────────┬─────────────────────────────┘
                                                     │ HTTPS / WSS / REST
                                                     ▼
                          ┌────────────────────────────────────────────────────────┐
                          │                  API GATEWAY & SECURITY                │
                          │   - Spring Security Filter Chain & JWT Validation      │
                          │   - Rate Limiting (Bucket4j / IP & Account Quotas)     │
                          │   - CORS, XSS, CSRF & Security Headers (CSP)           │
                          └──────────────────────────┬─────────────────────────────┘
                                                     │
                                                     ▼
 ┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
 │                                   CORE SPRING BOOT 3 SERVICES                                    │
 │                                                                                                 │
 │  ┌───────────────────────┐  ┌───────────────────────┐  ┌─────────────────────────────────────┐  │
 │  │      Auth & OTP       │  │  Eligibility Engine   │  │       Recruitment Pipeline          │  │
 │  │  - 2FA / Login OTP    │  │  - AST Rule Evaluator │  │  - Multi-Role Job Postings          │  │
 │  │  - Password Recovery  │  │  - Branch Whitelists  │  │  - Interview Rounds (1..N)          │  │
 │  │  - Daily Quota/Lockout│  │  - Arrear & CGPA gate │  │  - Candidate Round Evaluation       │  │
 │  └───────────────────────┘  └───────────────────────┘  └─────────────────────────────────────┘  │
 │                                                                                                 │
 │  ┌───────────────────────┐  ┌───────────────────────┐  ┌─────────────────────────────────────┐  │
 │  │   AI Match Service    │  │ Async Event Publisher │  │      WebSockets & In-App Push       │  │
 │  │  - Ollama DeepSeek    │  │  - Spring Events      │  │  - STOMP Broker (/topic, /user)     │  │
 │  │  - Skill Embeddings   │  │  - Decoupled Worker   │  │  - Live Candidate Status Sync       │  │
 │  │  - Cosine Similarity  │  │  - Idempotent Queue   │  │  - Instant Drive Announcements      │  │
 │  └───────────────────────┘  └───────────┬───────────┘  └─────────────────────────────────────┘  │
 └─────────────────────────────────────────┼───────────────────────────────────────────────────────┘
                                           │ @Async
                        ┌──────────────────┴──────────────────┐
                        ▼                                     ▼
             ┌─────────────────────┐               ┌─────────────────────┐
             │ Email Notification  │               │WhatsApp Notification│
             │ (JavaMail / Brevo)  │               │  (Twilio SDK / API) │
             └─────────────────────┘               └─────────────────────┘
                                           │
                                           ▼
 ┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
 │                                      PERSISTENCE LAYER                                          │
 │                                                                                                 │
 │   MySQL 8.0 Engine (InnoDB)                                                                     │
 │   - flyway_schema_history (V1..V8 automated schema versioning)                                  │
 │   - Relational Tables: users, students, tpo, hr_recruiters, drives, job_roles,                  │
 │                        interview_rounds, applications, application_round_history,                │
 │                        resumes, skills, drive_skills, otp_verifications, audit_logs             │
 │   - Performance Indexes: B-Trees on lookup fields, Composite keys, JSON vector embeddings      │
 └─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Multi-Phase Enterprise Implementation Roadmap

```
Phase 1: Domain & RBAC Foundation          ──► COMPLETED (Entities, Models, Unit Tests)
Phase 2: Persistence & Migrations          ──► COMPLETED (Flyway V1..V3, MySQL JPA)
Phase 3: Core API & Rule Engine            ──► COMPLETED (Eligibility Engine, REST CRUD)
Phase 4: Enterprise Auth & 2FA/OTP         ──► IN PROGRESS / REFINING (BCrypt, Quotas, Expiry)
─────────────────────────────────────────────────────────────────────────────────────────────
Phase 5: Multi-Role Drive & Round Tracker  ──► NEXT UP (HR Hub, Interview Rounds, Candidate Funnel)
Phase 6: Multi-Channel Event System        ──► NEXT UP (Async Events, Twilio, Email, STOMP)
Phase 7: Enterprise Frontend (3 Portals)   ──► NEXT UP (Student, HR Recruiter, TPO Command Center)
Phase 8: AI Parser & Semantic Matching     ──► NEXT UP (Spring AI + Ollama Vector Pipeline)
Phase 9: Reliability, Audit & Monitoring   ──► NEXT UP (Actuator, Prometheus, Logging MDC, Audit)
Phase 10: Docker, CI/CD & Cloud Deploy     ──► NEXT UP (Multi-stage Docker, Jenkins Pipeline)
```

---

### Detailed Breakdown of Next Phases

---

### Phase 4 (Polish) — Enterprise Auth, RBAC & OTP Security Hardening
**Objective**: Elevate the authentication layer to financial-grade resilience against credential stuffing and brute-force attacks.

* **Backend Deliverables**:
  1. **Complete Role Partitioning**: Enforce `ROLE_STUDENT`, `ROLE_TPO`, `ROLE_HR` across method-level security (`@PreAuthorize`).
  2. **Three-Way OTP Flows**:
     - *Registration Verification*: Verify student/TPO email on signup.
     - *Login 2FA (Optional/Configurable)*: Authenticate with password + 6-digit OTP.
     - *Password Reset*: Issue single-use, time-bound reset token upon valid OTP verification.
  3. **Security Safeguards**:
     - Exponential backoff after 3 consecutive failures.
     - Hard lockout after 5 invalid attempts with optimistic locking (`@Version`).
     - Daily rate-limiting (maximum 3 OTP requests/day/user).
     - Automated cron cleanup (`@Scheduled(cron = "0 */10 * * * *")`) to flush stale OTP hashes.
  4. **Token Security**: JWT Access Tokens (15 min expiry) + Refresh Tokens (7 days, rotated on use, stored with hash in DB for revocation).

---

### Phase 5 — Multi-Role Drive Engine & Interview Round Lifecycle
**Objective**: Allow companies (HR) to hire for multiple job roles in a single drive and manage candidates across custom multi-stage interview rounds.

* **Backend Architecture & Entities**:
  1. **`Company` & `HrRecruiter` Entities**: Company details (website, logo, industry) linked to one or more HR accounts.
  2. **`JobRole` Entity**: Belongs to `Drive` (e.g., "Full Stack Developer", "QA Automation", "DevOps Engineer") with specific CTC/package, vacancies, and skill requirements.
  3. **`InterviewRound` Entity**:
     - `Drive` 1 ── N `InterviewRound` (ordered by `roundSequence`: 1, 2, 3...).
     - Fields: `name` ("Online Coding", "Tech Interview 1", "HR Round"), `type` (`ONLINE_TEST`, `TECHNICAL`, `MANAGERIAL`, `HR`), `scheduledAt`, `venueOrLink`, `description`.
  4. **`ApplicationRoundHistory` Entity**:
     - Tracks applicant progression through each round: `PENDING`, `SHORTLISTED`, `CLEARED`, `REJECTED`, `ABSENT`.
     - Fields: `interviewerNotes`, `scoreRating` (1-10), `evaluatedAt`, `evaluatedBy`.
  5. **Endpoints**:
     - `POST /api/hr/drives/{id}/rounds` — Add interview round.
     - `PUT /api/hr/applications/{id}/round-status` — Advance or reject candidate in a round.
     - `GET /api/students/{id}/interviews` — Fetch complete interview pipeline for all applied drives.

---

### Phase 6 — Event-Driven Multi-Channel Notification Engine
**Objective**: Broadcast instant notifications to all eligible candidates when drives are posted and notify candidates as they advance through interview rounds.

* **Architecture**:
  1. **Decoupled Spring Event Bus**:
     - `DriveCreatedEvent`: Evaluates student eligibility asynchronously and queues notification dispatches.
     - `CandidateRoundStatusEvent`: Triggered when an HR updates a student's round result.
     - `DriveDeadlineReminderEvent`: Scheduled cron to notify students 24h before drive registration closes.
  2. **Multi-Channel Dispatcher Pattern**:
     - Common interface `NotificationSender` with implementations:
       - `EmailNotificationSender` (Thymeleaf HTML templates with responsive cards).
       - `WhatsAppNotificationSender` (Twilio REST API with sandbox fallback).
       - `WebSocketNotificationSender` (STOMP `/topic/drives`, `/user/{email}/queue/alerts`).
  3. **Enterprise Resilience**:
     - `@Retryable` with exponential backoff on third-party API network timeouts.
     - Dead-Letter handling (`NotificationLog` entity to track delivery status: `PENDING`, `SENT`, `FAILED`).

---

### Phase 7 — Enterprise Frontend (3 Tailored Portals)
**Objective**: Deliver a unified, ultra-clean web application tailored for all three enterprise personas using React, Tailwind CSS, Lucide icons, and Framer Motion, adhering to the Serio/Hirenza Teal Palette:
- `#17252A` (Deep Obsidian Slate)
- `#2B7A78` (Deep Forest Teal)
- `#3AAFA9` (Vibrant Mint Jade)
- `#DEF2F1` (Soft Mist Background)
- `#FEFFFF` (Pristine Card White)

* **Portal 1: Student Workspace**:
  - **Live Eligible Drives Feed**: Cards showing eligibility badge, CTC, match score %, deadline countdown.
  - **Interactive Interview Stepper**: Visual timeline showing progress through rounds (e.g., Round 1: Cleared ✓ ➔ Round 2: Technical Interview [Scheduled Oct 20, 10:00 AM] ➔ Round 3: HR).
  - **Resume & Skill Studio**: Text / PDF upload with extracted skill badges and AI recommendations.
  - **Notification Center**: Slide-out drawer with real-time push alerts.

* **Portal 2: HR Recruiter Command Center**:
  - **Drive & Role Builder**: Multi-step wizard to create drives, define roles, and configure cutoffs.
  - **Applicant Kanban Pipeline**: Drag-and-drop or status buttons to progress candidates (Applied ➔ Assessment ➔ Technical ➔ Final HR ➔ Selected).
  - **Candidate Evaluation Sheet**: Quick modal to leave scores and interviewer feedback.

* **Portal 3: TPO Executive Dashboard**:
  - **Placement Analytics & Metrics**:
    - Placement rate by department (CSE, IT, ECE, EEE, MECH) using Recharts.
    - Highest, median, and average CTC graphs.
    - Active vs. completed drives overview.
  - **Student Management Table**: Filter by CGPA, branch, arrears count, placement status.
  - **Export Center**: One-click export to CSV / Excel for college accreditation and management reports.

---

### Phase 8 — AI-Powered Resume Parser & Semantic Matching
**Objective**: Automatic skill extraction from candidate resumes and semantic relevance scoring using local LLMs.

* **Architecture**:
  1. **Document Ingestion**: Support PDF and text resume upload using Apache PDFBox / Tika.
  2. **Ollama + DeepSeek Local Inference**:
     - Structured JSON prompt engineering via Spring AI to extract technical skills, soft skills, and years of project experience.
  3. **Vector Embeddings & Storage**:
     - Compute high-dimensional embeddings via `nomic-embed-text`.
     - Stored directly in MySQL 8 `json` column type.
  4. **Hybrid Scoring Algorithm**:
     - `Total Score = (Hard Rule Gate: 0 or 1) * (0.6 * Semantic Embedding Similarity + 0.4 * Keyword Skill Overlap)`.
     - Displays transparent breakdown to students (e.g., "Matched 85% — Strong in Java, Spring Boot; Recommended to add: Docker, Kafka").

---

### Phase 9 — Observability, Governance & Enterprise Auditing
**Objective**: Ensure system stability, audit compliance, and continuous monitoring.

* **Deliverables**:
  1. **Spring Boot Actuator**: Health endpoints (`/actuator/health`), metrics (`/actuator/metrics`), Prometheus scrape target (`/actuator/prometheus`).
  2. **Centralized Logging & Correlation**:
     - SLF4J + Logback with MDC (Mapped Diagnostic Context) injecting `requestId`, `userEmail`, and `traceId` across async threads.
  3. **Enterprise Audit Trail**:
     - `AuditLog` entity capturing: `who`, `action` (`DRIVE_CREATED`, `ELIGIBILITY_OVERRIDE`, `ROUND_UPDATED`), `entityId`, `timestamp`, `ipAddress`.
  4. **RFC 7807 Standardized Errors**:
     - `GlobalExceptionHandler` returning consistent error structure: `type`, `title`, `status`, `detail`, `timestamp`, `path`.

---

### Phase 10 — DevOps, CI/CD & Production Deployment
**Objective**: Automated build, test verification, containerization, and staging deployment.

* **Deliverables**:
  1. **Docker Containerization**:
     - Multi-stage Dockerfile for Spring Boot (Eclipse Temurin 17 / Alpine JRE minimal footprint).
     - Multi-stage Dockerfile for React (Node 20 build ➔ Nginx Alpine runtime).
     - Production `docker-compose.yml` linking MySQL 8, Spring Boot Backend, Nginx Frontend, and Ollama.
  2. **Jenkins / GitHub Actions CI/CD Pipeline**:
     - Stage 1: Checkout & Code Linting.
     - Stage 2: Maven `mvn clean test` (Unit & Integration tests with Testcontainers).
     - Stage 3: JaCoCo code coverage verification (>80% threshold).
     - Stage 4: Docker image build & tag.
     - Stage 5: Deploy to Staging / Cloud (Render, Railway, or AWS EC2).

---

## 4. Database Schema Evolution Plan (Flyway Migrations)

| Migration | Scope | Key Tables / Columns Added |
|---|---|---|
| `V1__init_schema.sql` | Baseline | `students`, `tpo`, `drives`, `eligibility_rules`, `applications` |
| `V2__add_security_fields.sql` | Security | Password hashing, verification flags, `otp_verifications` |
| `V3__add_ai_skills.sql` | AI & Vector | `skills`, `resumes`, `resume_skills`, `drive_skills`, embedding JSON |
| `V4__add_hr_and_roles.sql` | Multi-Role | `companies`, `hr_recruiters`, `job_roles`, `drive_roles` |
| `V5__add_interview_rounds.sql` | Pipeline | `interview_rounds`, `application_round_history` |
| `V6__add_audit_and_indexes.sql` | Governance | `audit_logs`, B-Tree indexes on `(student_id, drive_id)`, status indexes |
| `V7__add_notifications.sql` | Comms | `in_app_notifications`, `notification_logs` |

---

## 5. Strategic Interview Defense Guide (Zoho / Tier-1 Product Prep)

| Architecture Choice | Why We Did It | Interview Defense |
|---|---|---|
| **MySQL JSON embeddings over Pinecone/Milvus** | Simplicity & operational efficiency | Eliminates distributed database overhead, network hops, and operational cost for small-to-medium datasets (<100K candidates). Cosine similarity in Java service is fast and predictable. |
| **Decoupled Spring Events over Direct Service Calls** | Separation of Concerns | Drive creation should never fail or slow down because an external email or WhatsApp gateway timed out. Asynchronous event listeners handle retries independently. |
| **BCrypt Hashed OTPs in DB** | Zero Plaintext Exposure | Even with DB read access, an attacker cannot read active OTPs. Combined with 5-minute expiry and 5-attempt limit, brute-forcing a 6-digit code has an astronomically low probability. |
| **Custom Rule Engine over Hardcoded Filters** | Scalability & Extensibility | Rules are modeled as polymorphic entities (`CGPA_CUTOFF`, `BRANCH_WHITELIST`, `MAX_ARREARS`). Adding a new rule type (e.g., `10TH_PERCENTAGE`) requires zero modifications to existing drive records. |
| **Optimistic Locking (`@Version`) on OTP** | Race Condition Prevention | Prevents rapid-fire concurrent requests from exploiting timing windows during OTP validation attempts. |
