# Hirenza — Campus Placement & Eligibility Coordination Platform

Resume project for Zoho (Software Developer / Java Software Engineer, fresher, Chennai) placement prep.

**Tech stack**: Java, Spring Boot, Spring Data JPA, Spring Security + JWT, MySQL (single database, no NoSQL), Spring AI + Ollama, React, Docker, Jenkins, Twilio (WhatsApp), JavaMailSender/Brevo (email), OTP-based account verification.

---

## Problem Statement

Your college's placement process runs on manual coordination — WhatsApp groups, PDFs on a noticeboard, students individually checking each drive's eligibility with the TPO, and no structured way to see "which drives am I actually eligible for" or track where an application stands across rounds. The TPO cell has the mirror problem: no live view of who's eligible, who's applied, or placement rate per branch without maintaining a spreadsheet by hand.

**What's different here**: this isn't a generic "campus placement portal" clone. The core engineering problem is a *rule engine* — eligibility criteria differ per drive (CGPA cutoffs, branch restrictions, backlog rules) and need to be evaluated correctly and transparently against each student's profile, automatically. That rule-evaluation logic, built clean and tested, is the real technical core; auth, dashboards, and notifications are standard scaffolding around it.

---

## Architecture

```
Student & TPO web app (React)
            │
            ▼
   Spring Boot REST API
(auth + OTP verification +
 eligibility engine + AI matching)
            │
            ▼
         MySQL
(students, drives, rules,
 applications, resumes,
 skills, OTP records)
```

**Design note**: resume text, extracted skills, skill-embedding vectors, and OTP records all live in MySQL instead of adding a second database. At this project's scale, a dedicated vector/NoSQL store is unnecessary complexity — similarity matching is computed in the Java service layer. This is a deliberate trade-off worth stating explicitly in an interview: it shows you can recognize when *not* to add infrastructure, not just when to add it.

**Notification flow** (separate from the request/response path above — runs asynchronously):

```
Status or drive event
         │
         ▼
  Spring event published  (async, decoupled)
         │
         ▼
 Notification listeners   (one per channel)
      │         │
      ▼         ▼
   Email     WhatsApp
(SMTP/Brevo) (Twilio sandbox)
```

---

## Build Plan

### Phase 1 — Domain design in plain Java
Before touching Spring, model `Student`, `TPO`, `Drive`, `EligibilityRule`, and `Application` as plain Java classes. Write the eligibility-check logic as a method you can unit test with no framework involved — this is the piece you'll explain in interviews, so understand it cold before Spring hides the wiring.
**Tools**: IntelliJ IDEA, Maven, Git (commit from day one), Excalidraw for a quick ER sketch.

### Phase 2 — Persistence layer (MySQL)
Turn the domain model into JPA entities with proper relationships (`Student` 1–N `Application`, `Drive` 1–N `EligibilityRule`, `Student` 1–N `Resume`). Design the schema so resumes, extracted skills, and OTP records fit naturally as relational tables (`resumes`, `skills`, `resume_skills`, `otp_verifications`) rather than reaching for a document store. Version your schema instead of hand-editing tables.
**Tools**: Spring Data JPA, MySQL Workbench, Flyway for schema migrations, Testcontainers (spins up a real throwaway MySQL for integration tests).

### Phase 3 — Core REST API + eligibility engine
Build CRUD endpoints for drives, students, and applications, then wire in the eligibility engine as a clean, independently testable service. This is the part worth the most polish — write thorough unit tests here specifically.
**Tools**: Spring Boot, Postman, springdoc-openapi for auto-generated API docs, JUnit 5 + Mockito.

### Phase 4 — Auth, roles & OTP verification
Add Student vs TPO roles and protect endpoints accordingly. Before issuing a JWT, verify the account with a one-time password: generate a random 6-digit code, **hash it before storing** (never plaintext), set a short expiry (5–10 min) and a max-attempts limit, and add a resend cooldown plus a per-account rate limit on OTP requests to prevent abuse. Send the OTP by **email first** — WhatsApp delivery depends on the student already having opted into the Twilio sandbox, so it can't be the very first verification step; offer WhatsApp as a second OTP channel later, once that opt-in has happened.
**Tools**: Spring Security, JWT (jjwt library), `java.security.SecureRandom` for OTP generation, BCrypt for hashing, Spring `@Scheduled` to purge expired OTP records, JavaMailSender/Brevo for delivery, Postman for testing the full flow.

### Phase 5 — Real-time status & notifications (email + WhatsApp)
When a TPO updates an application's status or posts a new drive, publish a Spring application event rather than calling the notification logic directly from the controller. Async listeners dispatch through a common `NotificationSender` interface, so Email and WhatsApp are separate, independently testable implementations (Strategy pattern). Only notify students the eligibility engine already marked eligible — don't blast everyone. For WhatsApp, use **Twilio's free Sandbox**, not Meta's Cloud API directly: no business verification needed, and a student opts in by sending a one-time join code to the sandbox number, which doubles as consent. Add retry with backoff so a failed send doesn't silently vanish.
**Tools**: Spring `ApplicationEventPublisher` + `@Async`, Spring WebSocket (STOMP) or SSE for in-app live updates, JavaMailSender/Brevo, Twilio Java SDK, Spring Retry, Thymeleaf for email templates.

### Phase 6 — Resume storage + AI matching (MySQL-native)
Store resume text and extracted skills in MySQL. Use Spring AI with a local model (Ollama running DeepSeek) to extract skills and generate an embedding vector per resume and per drive requirement — store the vector as a JSON/text column, and compute cosine similarity in a Java service at query time. This directly reuses what you've studied in Spring AI, without adding a second database.
**Tools**: Spring AI, Ollama, MySQL JSON column type.

### Phase 7 — Frontend dashboards
Build the Student view (eligible drives, application tracker) and TPO view (create drives, analytics). Keep it clean rather than feature-heavy — a sparse, well-designed dashboard beats a cluttered one in a demo.
**Tools**: React + Vite, Tailwind CSS, Recharts for TPO analytics charts, Axios.

### Phase 8 — Testing, Docker, CI/CD, deploy
Write the remaining test coverage, containerize with Docker, set up a pipeline, and deploy somewhere real so you can actually hand it to your TPO cell.
**Tools**: Docker + docker-compose, Jenkins (matches Zoho's stack directly), JaCoCo for coverage, Railway/Render free tier for deployment.

---

## AI-Era Tools — Using Them Without Losing the Learning

| Layer | Use AI for | Do yourself |
|---|---|---|
| Domain design | Ask Claude to critique your entity design and spot missing relationships | Draw the model and write the eligibility logic yourself — it's your core differentiator |
| Backend boilerplate | GitHub Copilot / Claude Code for DTOs, getters/setters, repetitive CRUD | The eligibility engine's actual logic — you need to defend this in an interview |
| Security (OTP, hashing) | Ask AI to review your OTP flow for brute-force gaps or timing issues | Implement the hashing, expiry, and rate-limiting yourself — this is security logic you must understand, not copy |
| Testing | Generate test skeletons with AI | Decide which edge cases actually matter (e.g., a student exactly at the CGPA cutoff, an expired OTP) |
| Code review | Run Claude Code or a linter as a pre-commit check | Understand *why* something was flagged before accepting the fix |
| SQL/queries | Ask AI to explain a slow query's execution plan | Fix the query yourself once you understand why it's slow |
| DevOps config | Generate a first-draft Dockerfile/Jenkinsfile with AI | Read every line and be able to explain what it does |
| AI/LLM integration (Spring AI + Ollama) | — | Build it yourself — this *is* the skill you're trying to prove you have |

**The pattern**: AI removes the boring typing, you keep the thinking. "Yes, I used AI for boilerplate, here's the part I designed myself" is a far stronger interview answer than silence or over-claiming.
