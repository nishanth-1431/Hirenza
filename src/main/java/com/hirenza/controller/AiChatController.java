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

        if (activeDrives != null && !activeDrives.isEmpty() && (q.contains("drive") || q.contains("companies") || q.contains("list"))) {
            StringBuilder sb = new StringBuilder("### 🚀 Live Drives in Hirenza Placement Portal\n\n");
            for (Drive d : activeDrives) {
                sb.append("* **").append(d.getCompanyName()).append("** — *").append(d.getRole()).append("*\n");
                sb.append("  • Deadline: ").append(d.getApplicationDeadline()).append("\n");
                if (d.getEligibilityRules() != null && !d.getEligibilityRules().isEmpty()) {
                    sb.append("  • Rules: ");
                    for (EligibilityRule r : d.getEligibilityRules()) {
                        sb.append(r.toString()).append(" ");
                    }
                    sb.append("\n");
                }
            }
            sb.append("\n*All eligibility is checked deterministically with zero manual bypass.*");
            return sb.toString();
        }

        if (q.contains("zoho")) {
            return "### 🏢 Zoho Corporation — SDE\n\n" +
                   "* **Eligibility Cutoff**: **7.5 CGPA**, max **0 backlogs**.\n" +
                   "* **Eligible Branches**: CSE, IT, ECE.\n\n" +
                   "**Interview Stages:**\n" +
                   "* Round 1: Online Aptitude & Programming (90 mins)\n" +
                   "* Round 2: Advanced Coding & Data Structures (3 problems)\n" +
                   "* Round 3: Tech Interview & System Design\n" +
                   "* Round 4: HR & Culture Fit\n\n" +
                   "💡 **Preparation Tip**: Focus on recursion, matrix manipulation, and time complexity.";
        }
        if (q.contains("amazon")) {
            return "### 📦 Amazon — SDE 1\n\n" +
                   "* **Eligibility Cutoff**: **8.5 CGPA**, strictly **0 active arrears**.\n" +
                   "* **Eligible Branches**: CSE, IT, ECE, EEE.\n\n" +
                   "**Interview Stages:**\n" +
                   "* Round 1: Online Assessment (OA Coding + Work Style)\n" +
                   "* Round 2: Tech Interview 1 (Trees, Graphs, DP)\n" +
                   "* Round 3: Tech Interview 2 (OOP Design & Architecture)\n" +
                   "* Round 4: Bar Raiser & Amazon Leadership Principles\n\n" +
                   "💡 **Preparation Tip**: Practice Medium/Hard DP and Trees. Review all Leadership Principles using STAR format.";
        }
        if (q.contains("tcs")) {
            return "### 💼 TCS Digital / Prime\n\n" +
                   "* **Eligibility Cutoff**: **7.0 CGPA**, max **1 standing backlog**.\n" +
                   "* **Eligible Branches**: All Engineering Branches.\n\n" +
                   "**Interview Stages:**\n" +
                   "* Round 1: National Qualifier Test (NQT)\n" +
                   "* Round 2: Technical Interview (Core CS, SQL, OOP)\n" +
                   "* Round 3: HR & Management Interview\n\n" +
                   "💡 **Preparation Tip**: Review SQL indexing, normalization, and OOP in Java.";
        }
        if (q.contains("eligib") || q.contains("cgpa") || q.contains("cutoff")) {
            return "### 🎯 Hirenza Eligibility Gating Rules\n\n" +
                   "Hirenza evaluates your profile deterministically with zero manual bypass:\n\n" +
                   "* **Amazon**: CGPA >= 8.5, 0 Arrears (CSE, IT, ECE, EEE)\n" +
                   "* **Zoho**: CGPA >= 7.5, 0 Arrears (CSE, IT, ECE)\n" +
                   "* **TCS Digital**: CGPA >= 7.0, <= 1 Arrear (All Branches)\n\n" +
                   "Eligible candidates can confirm their slot and track live interview round telemetry directly from the dashboard.";
        }
        return "### 🤖 Hirenza AI Placement Copilot\n\n" +
               "I can assist you with:\n\n" +
               "* **Live Drive Eligibility**: Ask *'Am I eligible for Zoho?'* or *'Check cutoff for Amazon'*\n" +
               "* **Interview Preparation**: Ask *'Give me 3 Java questions'* or *'How to prepare for Round 1'*\n" +
               "* **Recruiter Pipelines**: Ask *'How to create an interview sequence'*\n\n" +
               "What would you like assistance with today?";
    }
}
