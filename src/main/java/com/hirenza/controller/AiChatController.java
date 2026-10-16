package com.hirenza.controller;

import com.hirenza.domain.Drive;
import com.hirenza.domain.EligibilityRule;
import com.hirenza.domain.Student;
import com.hirenza.dto.AiChatRequest;
import com.hirenza.dto.AiChatResponse;
import com.hirenza.repository.DriveRepository;
import com.hirenza.repository.StudentRepository;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AiChatController {

    private final ChatClient chatClient;
    private final DriveRepository driveRepository;
    private final StudentRepository studentRepository;

    public AiChatController(
            @Autowired(required = false) ChatClient.Builder chatClientBuilder,
            @Autowired(required = false) DriveRepository driveRepository,
            @Autowired(required = false) StudentRepository studentRepository) {
        if (chatClientBuilder != null) {
            this.chatClient = chatClientBuilder.build();
        } else {
            this.chatClient = null;
        }
        this.driveRepository = driveRepository;
        this.studentRepository = studentRepository;
    }

    @PostMapping("/chat")
    public ResponseEntity<AiChatResponse> chat(@RequestBody AiChatRequest request) {
        String userMessage = request.getMessage() != null ? request.getMessage() : "";
        String role = request.getRole() != null ? request.getRole() : "GUEST";

        // Fetch Student context if available
        Student student = null;
        if (studentRepository != null) {
            if (request.getUserId() != null) {
                student = studentRepository.findById(request.getUserId()).orElse(null);
            }
            if (student == null && request.getEmail() != null) {
                student = studentRepository.findByEmail(request.getEmail()).orElse(null);
            }
        }

        // Fetch Active Drives context if available
        List<Drive> activeDrives = null;
        if (driveRepository != null) {
            try {
                activeDrives = driveRepository.findAll();
            } catch (Exception ignored) {
            }
        }

        StringBuilder dynamicContext = new StringBuilder();
        if (student != null) {
            dynamicContext.append("\nAuthenticated Student Profile:\n")
                    .append("- Name: ").append(student.getName()).append("\n")
                    .append("- CGPA: ").append(student.getCgpa()).append("\n")
                    .append("- Branch: ").append(student.getBranch()).append("\n")
                    .append("- Standing Arrears: ").append(student.getArrearsCount()).append("\n");
        }

        if (activeDrives != null && !activeDrives.isEmpty()) {
            dynamicContext.append("\nLive Database Drives in Hirenza:\n");
            for (Drive d : activeDrives) {
                dynamicContext.append("• ").append(d.getCompanyName()).append(" - ").append(d.getRole())
                        .append(" (Deadline: ").append(d.getApplicationDeadline()).append(")\n");
            }
        }

        String systemPrompt = """
            You are the intelligent Placement Copilot for Hirenza (an enterprise campus recruitment orchestration platform).
            You help Students, HR Recruiters, and TPOs.
            
            Standard Campus Drives & Cutoffs:
            1. Amazon SDE 1: CGPA >= 8.5, 0 Arrears, Branches: CSE, IT, ECE, EEE. Rounds: OA -> Tech 1 (DSA/Trees) -> Tech 2 (System Design) -> Bar Raiser (LP).
            2. Zoho SDE: CGPA >= 7.5, 0 Arrears, Branches: CSE, IT, ECE. Rounds: Aptitude & C/Java -> Advanced DSA -> Tech Interview 1 -> HR.
            3. TCS Digital / Prime: CGPA >= 7.0, <= 1 Arrear, Branches: All. Rounds: NQT -> Technical -> HR.
            
            Rule Engine: Hirenza enforces zero-bypass deterministic gating on CGPA cutoffs, standing arrears, and branch whitelists.
            %s
            Format responses clearly with bullet points and bold text where helpful. Be concise, polite, and professional.
            User Role: %s
            """.formatted(dynamicContext.toString(), role);

        // Try querying Ollama / Spring AI
        if (chatClient != null) {
            try {
                String reply = chatClient.prompt()
                        .system(systemPrompt)
                        .user(userMessage)
                        .call()
                        .content();

                if (reply != null && !reply.isBlank()) {
                    return ResponseEntity.ok(new AiChatResponse(reply, "deepseek-r1:1.5b"));
                }
            } catch (Exception e) {
                System.err.println("Ollama local LLM call bypassed: " + e.getMessage());
            }
        }

        // Deterministic Fallback with Student & Drive Awareness
        String fallbackReply = generateFallbackReply(userMessage.toLowerCase(), student, activeDrives);
        return ResponseEntity.ok(new AiChatResponse(fallbackReply, "hirenza-rule-engine-v1"));
    }

    private String generateFallbackReply(String q, Student student, List<Drive> activeDrives) {
        // Personalized Student Eligibility Check
        if (student != null && (q.contains("eligib") || q.contains("am i") || q.contains("can i apply") || q.contains("check my"))) {
            double cgpa = student.getCgpa();
            int arrears = student.getArrearsCount();
            String branch = student.getBranch() != null ? student.getBranch().toUpperCase() : "CSE";

            boolean zohoEligible = cgpa >= 7.5 && arrears == 0 && (branch.contains("CS") || branch.contains("IT") || branch.contains("EC"));
            boolean amazonEligible = cgpa >= 8.5 && arrears == 0 && (branch.contains("CS") || branch.contains("IT") || branch.contains("EC") || branch.contains("EE"));
            boolean tcsEligible = cgpa >= 7.0 && arrears <= 1;

            return "### 🎯 Personalized Eligibility Check for " + student.getName() + "\n\n" +
                   "**Your Verified Academic Profile:**\n" +
                   "* **CGPA**: **" + cgpa + "** | **Standing Arrears**: **" + arrears + "** | **Branch**: **" + branch + "**\n\n" +
                   "**Evaluation Against Active Campus Drives:**\n" +
                   "* **Zoho SDE** (Cutoff: 7.5 CGPA, 0 Arrears): " + 
                     (zohoEligible ? "✅ **ELIGIBLE** — You meet all requirements! Slot booking open." 
                                   : "❌ **NOT ELIGIBLE** — " + (cgpa < 7.5 ? "CGPA below 7.5 threshold." : (arrears > 0 ? "Requires 0 standing arrears." : "Branch not in whitelist."))) + "\n" +
                   "* **Amazon SDE 1** (Cutoff: 8.5 CGPA, 0 Arrears): " + 
                     (amazonEligible ? "✅ **ELIGIBLE** — Top tier profile match! OA scheduled soon." 
                                     : "❌ **NOT ELIGIBLE** — " + (cgpa < 8.5 ? "Requires 8.5+ CGPA." : (arrears > 0 ? "0 arrears required." : "Branch restricted."))) + "\n" +
                   "* **TCS Digital / Prime** (Cutoff: 7.0 CGPA, <= 1 Arrear): " + 
                     (tcsEligible ? "✅ **ELIGIBLE** — Application accepted across all branches." 
                                  : "❌ **NOT ELIGIBLE** — " + (cgpa < 7.0 ? "Requires 7.0+ CGPA." : "Max 1 arrear allowed."))) + "\n\n" +
                   "💡 *Head to your **Student Dashboard** to confirm your test slot and track telemetry.*";
        }

        boolean isDriveQuery = q.contains("driv") || q.contains("compani") || q.contains("activ") || 
                               q.contains("upcom") || q.contains("avail") || q.contains("open") || 
                               (q.contains("what") && (q.contains("there") || q.contains("list")));

        if (isDriveQuery) {
            String studentName = student != null ? student.getName() : "Candidate";
            double cgpa = student != null ? student.getCgpa() : 8.2;
            int arrears = student != null ? student.getArrearsCount() : 0;
            String branch = student != null && student.getBranch() != null ? student.getBranch().toUpperCase() : "CSE";

            StringBuilder sb = new StringBuilder();
            sb.append("### 🚀 Campus Drives & Upcoming Hiring Pipeline\n\n");
            sb.append("Evaluated for: ").append(studentName)
              .append(" (CGPA: ").append(cgpa)
              .append(" | Arrears: ").append(arrears)
              .append(" | Branch: ").append(branch).append(")\n\n");

            // Drive 1: Zoho
            boolean zohoOk = cgpa >= 7.5 && arrears == 0 && (branch.contains("CS") || branch.contains("IT") || branch.contains("EC"));
            sb.append("🏢 Zoho Corporation — Software Development Engineer (SDE)\n")
              .append("• Package: ₹8.5 - ₹12.0 LPA\n")
              .append("• Status: ").append(zohoOk ? "✅ ELIGIBLE (Ready to Apply)" : "❌ Ineligible (Min 7.5 CGPA, 0 Arrears)")
              .append("\n• Deadline: Oct 25, 2026 (Closing in 8 days)\n")
              .append("• Rounds: Aptitude & C/Java -> Advanced DSA -> Tech Interview -> HR\n\n");

            // Drive 2: Freshworks
            boolean fwOk = cgpa >= 7.0 && arrears == 0 && (branch.contains("CS") || branch.contains("IT") || branch.contains("EC") || branch.contains("EE"));
            sb.append("🏢 Freshworks — Frontend Developer (React)\n")
              .append("• Package: ₹9.0 LPA\n")
              .append("• Status: ").append(fwOk ? "✅ ELIGIBLE (Ready to Apply)" : "❌ Ineligible (Min 7.0 CGPA, 0 Arrears)")
              .append("\n• Deadline: Nov 20, 2026 (Upcoming)\n")
              .append("• Rounds: HackerRank OA -> Tech Architecture -> HR Discussion\n\n");

            // Drive 3: Amazon
            boolean amzOk = cgpa >= 8.5 && arrears == 0 && (branch.contains("CS") || branch.contains("IT") || branch.contains("EC") || branch.contains("EE"));
            sb.append("📦 Amazon — SDE 1 (Campus)\n")
              .append("• Package: ₹28.0 - ₹32.0 LPA\n")
              .append("• Status: ").append(amzOk ? "✅ ELIGIBLE" : "⚠️ Needs 8.5 CGPA (Current: " + cgpa + " • Gap: " + String.format("%.1f", Math.max(0, 8.5 - cgpa)) + ")")
              .append("\n• Deadline: Nov 28, 2026 (Upcoming)\n")
              .append("• Rounds: OA Coding -> Tech 1 (DSA/Trees) -> Tech 2 (System Design) -> Bar Raiser\n\n");

            // Drive 4: Microsoft
            boolean msOk = cgpa >= 8.0 && arrears == 0 && (branch.contains("CS") || branch.contains("IT"));
            sb.append("💻 Microsoft — Software Engineer Intern\n")
              .append("• Package: ₹24.0 LPA (₹1.25L/mo stipend)\n")
              .append("• Status: ").append(msOk ? "✅ ELIGIBLE (Top Profile Match)" : "❌ Ineligible (Requires 8.0+ CGPA)")
              .append("\n• Deadline: Nov 15, 2026 (Upcoming)\n")
              .append("• Rounds: Codility OA -> Technical Interview -> System Architecture\n\n");

            // Drive 5: TCS
            boolean tcsOk = cgpa >= 7.0 && arrears <= 1;
            sb.append("💼 TCS Digital / Prime — Systems Engineer\n")
              .append("• Package: ₹7.0 - ₹9.0 LPA\n")
              .append("• Status: ").append(tcsOk ? "✅ ELIGIBLE (All Branches Allowed)" : "❌ Ineligible")
              .append("\n• Deadline: Oct 30, 2026 (Closing in 13 days)\n")
              .append("• Rounds: NQT Cognitive & Coding -> Technical (SQL/OOP) -> Management HR\n\n");

            sb.append("💡 Suggested Functions:\n")
              .append("• Ask 'Apply to Zoho' to book your slot.\n")
              .append("• Ask 'Give me Zoho Round 1 questions' for practice.\n")
              .append("• Ask 'What do I need for Amazon?' for preparation roadmap.");

            return sb.toString();
        }

        if (q.contains("zoho")) {
            return "### 🏢 Zoho Corporation — SDE\n\n" +
                   "• Eligibility Cutoff: 7.5 CGPA, strictly 0 backlogs\n" +
                   "• Eligible Branches: CSE, IT, ECE\n" +
                   "• Package: ₹8.5 - ₹12.0 LPA\n" +
                   "• Deadline: Oct 25, 2026 (Closing Soon)\n\n" +
                   "Interview Stages Workflow:\n" +
                   "1. Round 1: Online Aptitude & Programming in C/Java (90 mins)\n" +
                   "2. Round 2: Advanced Coding & Data Structures (3 problems)\n" +
                   "3. Round 3: Tech Interview & System Design (45 mins)\n" +
                   "4. Round 4: HR & Culture Alignment\n\n" +
                   "💡 Preparation Tip: Focus on recursion, matrix manipulation, pointers, and algorithmic complexity.";
        }
        if (q.contains("amazon")) {
            return "### 📦 Amazon — SDE 1 (Campus)\n\n" +
                   "• Eligibility Cutoff: 8.5 CGPA, strictly 0 standing backlogs\n" +
                   "• Eligible Branches: CSE, IT, ECE, EEE\n" +
                   "• Package: ₹28.0 - ₹32.0 LPA\n" +
                   "• Deadline: Nov 28, 2026 (Upcoming)\n\n" +
                   "Sequential Interview Pipeline:\n" +
                   "1. Round 1: Online Assessment (OA) — 2 LeetCode Mediums + Work Style\n" +
                   "2. Round 2: Technical Interview 1 — Trees, Graphs & Dynamic Programming\n" +
                   "3. Round 3: Technical Interview 2 — Object-Oriented Design & System Architecture\n" +
                   "4. Round 4: Bar Raiser & Amazon Leadership Principles (LP)\n\n" +
                   "💡 Preparation Tip: Practice Medium/Hard DP and Trees on LeetCode. Review 16 Leadership Principles using STAR format.";
        }
        if (q.contains("tcs")) {
            return "### 💼 TCS Digital / Prime\n\n" +
                   "• Eligibility Cutoff: 7.0 CGPA, max 1 standing backlog\n" +
                   "• Eligible Branches: All Engineering Branches\n" +
                   "• Package: ₹7.0 - ₹9.0 LPA\n" +
                   "• Deadline: Oct 30, 2026\n\n" +
                   "Hiring Stages:\n" +
                   "1. Round 1: National Qualifier Test (NQT) — Cognitive & Advanced Coding\n" +
                   "2. Round 2: Technical Interview — Core CS, DBMS, OOPs, SQL\n" +
                   "3. Round 3: HR & Management Discussion\n\n" +
                   "💡 Preparation Tip: Strong fundamentals in SQL indexing, normalization, and OOP concepts in Java/Python.";
        }
        if (q.contains("eligib") || q.contains("cgpa") || q.contains("cutoff")) {
            return "### 🎯 Hirenza Zero-Bypass Eligibility Gating\n\n" +
                   "Hirenza evaluates your profile deterministically before slot booking:\n\n" +
                   "• Amazon SDE: CGPA >= 8.5, 0 Arrears (CSE, IT, ECE, EEE)\n" +
                   "• Zoho SDE: CGPA >= 7.5, 0 Arrears (CSE, IT, ECE)\n" +
                   "• Microsoft SWE: CGPA >= 8.0, 0 Arrears (CSE, IT)\n" +
                   "• Freshworks: CGPA >= 7.0, 0 Arrears (CSE, IT, ECE, EEE)\n" +
                   "• TCS Digital: CGPA >= 7.0, <= 1 Arrear (All Branches)\n\n" +
                   "Eligible candidates can confirm their slot and track live interview round telemetry directly from the dashboard.";
        }
        return "### 🤖 Hirenza AI Placement Copilot\n\n" +
               "I can assist you with:\n\n" +
               "• Live Drive Eligibility: Ask 'Am I eligible for Zoho?' or 'Check cutoff for Amazon'\n" +
               "• Active & Upcoming Drives: Ask 'Show all active and upcoming drives'\n" +
               "• Interview Preparation: Ask 'Give me 3 Java questions' or 'How to prepare for Round 1'\n" +
               "• Recruiter Pipelines: Ask 'How to create an interview sequence'\n\n" +
               "What would you like assistance with today?";
    }
}
