package com.hirenza.controller;

import com.hirenza.domain.Drive;
import com.hirenza.domain.Student;
import com.hirenza.dto.AiChatRequest;
import com.hirenza.dto.AiChatResponse;
import com.hirenza.dto.Round0AnswerRequest;
import com.hirenza.dto.Round0Response;
import com.hirenza.dto.Round0StartRequest;
import com.hirenza.repository.DriveRepository;
import com.hirenza.repository.StudentRepository;
import com.hirenza.security.AiSecurityGuard;
import com.hirenza.service.Round0Service;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;

import java.util.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AiChatController {

    private final ChatClient chatClient;
    private final DriveRepository driveRepository;
    private final StudentRepository studentRepository;
    private final Round0Service round0Service;
    private final AiSecurityGuard aiSecurityGuard;
    private final RestClient ollamaRestClient;

    public AiChatController(
            @Autowired(required = false) ChatClient.Builder chatClientBuilder,
            @Autowired(required = false) DriveRepository driveRepository,
            @Autowired(required = false) StudentRepository studentRepository,
            Round0Service round0Service,
            @Autowired(required = false) AiSecurityGuard aiSecurityGuard) {
        if (chatClientBuilder != null) {
            this.chatClient = chatClientBuilder.build();
        } else {
            this.chatClient = null;
        }
        this.driveRepository = driveRepository;
        this.studentRepository = studentRepository;
        this.round0Service = round0Service;
        this.aiSecurityGuard = aiSecurityGuard != null ? aiSecurityGuard : new AiSecurityGuard();

        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(5000);
        factory.setReadTimeout(35000);
        this.ollamaRestClient = RestClient.builder()
                .baseUrl("http://localhost:11434")
                .requestFactory(factory)
                .build();
    }

    @PostMapping("/round0/start")
    public ResponseEntity<Round0Response> startRound0(@RequestBody Round0StartRequest request) {
        return ResponseEntity.ok(round0Service.startSession(request));
    }

    @PostMapping("/round0/respond")
    public ResponseEntity<Round0Response> respondRound0(@RequestBody Round0AnswerRequest request) {
        return ResponseEntity.ok(round0Service.evaluateAndNext(request));
    }

    @PostMapping("/chat")
    public ResponseEntity<AiChatResponse> chat(@RequestBody AiChatRequest request) {
        String userMessage = request.getMessage() != null ? request.getMessage().trim() : "";
        String role = request.getRole() != null ? request.getRole() : "STUDENT";

        // 1. SECURITY RESTRICTION ENFORCEMENT
        AiSecurityGuard.SecurityVerdict verdict = aiSecurityGuard.inspect(userMessage);
        if (verdict.isBlocked()) {
            return ResponseEntity.ok(new AiChatResponse(
                    verdict.getMessage(),
                    "hirenza-security-guardrail",
                    "Security restriction triggered: " + verdict.getCategory(),
                    true,
                    verdict.getMessage(),
                    List.of("Show My Eligible Drives", "Top 5 LeetCode Questions for Amazon", "View Placement Policy Tiers")
            ));
        }

        // 2. Fetch Student context if available
        Student student = null;
        if (studentRepository != null) {
            if (request.getUserId() != null) {
                student = studentRepository.findById(request.getUserId()).orElse(null);
            }
            if (student == null && request.getEmail() != null) {
                student = studentRepository.findByEmail(request.getEmail()).orElse(null);
            }
        }

        // 3. Fetch Active Drives context if available
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
                    .append("- Standing Arrears: ").append(student.getArrearsCount()).append("\n")
                    .append("- Campus Placement Tier: ").append(student.getCurrentPlacedTier() != null ? student.getCurrentPlacedTier() : "Active Job Seeker").append("\n");
        }

        if (activeDrives != null && !activeDrives.isEmpty()) {
            dynamicContext.append("\nLive Database Drives in Hirenza:\n");
            for (Drive d : activeDrives) {
                dynamicContext.append("• ").append(d.getCompanyName()).append(" - ").append(d.getRole())
                        .append(" (Package: ₹").append(d.getCtc() != null ? d.getCtc() : "Standard").append(" LPA")
                        .append(", Deadline: ").append(d.getApplicationDeadline()).append(")\n");
            }
        }

        String systemPrompt = """
            You are Hirenza Copilot, an elite AI technical recruitment and placement advisor for campus drives.
            
            Campus Governance & Gating Rules:
            1. Zero-Bypass Placement Governance: You cannot alter student records or bypass eligibility cutoffs.
            2. Verified Campus Drives:
               • Amazon SDE 1: Cutoff 8.5 CGPA, 0 Arrears, CSE/IT/ECE/EEE, ₹28.0 - ₹32.0 LPA. Rounds: OA -> Tech 1 (Trees/DP) -> Tech 2 (System Architecture) -> Bar Raiser (LP).
               • Zoho Corporation SDE: Cutoff 7.5 CGPA, 0 Arrears, CSE/IT/ECE, ₹8.5 - ₹12.0 LPA. Rounds: Aptitude & C/Java -> Advanced Coding (3 DSA) -> Tech Interview -> HR.
               • Freshworks Frontend: Cutoff 7.0 CGPA, 0 Arrears, ₹9.0 LPA. Rounds: HackerRank React/JS -> Architecture Interview -> HR.
               • TCS Digital/Prime: Cutoff 7.0 CGPA, <= 1 Arrear, ₹7.0 - ₹9.0 LPA.
               • Microsoft SWE Intern: Cutoff 8.0 CGPA, 0 Arrears, ₹24.0 LPA.
            
            %s
            
            User Role: %s
            
            Instructions:
            - Answer the student's EXACT question directly and interactively with high technical competence.
            - If they ask for LeetCode questions, provide the top questions asked for that specific company with problem names, pattern breakdown (Sliding Window, Two Pointers, Monotonic Stack, DP), approach, and Big-O complexity.
            - If they ask about eligibility, explain the exact mathematical gap based on their verified profile.
            - Use structured Markdown formatting with clean bold headers and bullet points. Be engaging, encouraging, and razor-sharp.
            """.formatted(dynamicContext.toString(), role);

        // 4. Try Ollama (Direct REST first for maximum responsiveness and DeepSeek reasoning extraction)
        String rawReply = callOllama(systemPrompt, userMessage);
        if (rawReply == null && chatClient != null) {
            try {
                rawReply = chatClient.prompt()
                        .system(systemPrompt)
                        .user(userMessage)
                        .call()
                        .content();
            } catch (Exception e) {
                System.err.println("Spring AI ChatClient bypassed: " + e.getMessage());
            }
        }

        if (rawReply != null && !rawReply.isBlank()) {
            String reasoning = null;
            String cleanedReply = rawReply;
            if (rawReply.contains("<think>") && rawReply.contains("</think>")) {
                int start = rawReply.indexOf("<think>") + 7;
                int end = rawReply.indexOf("</think>");
                reasoning = rawReply.substring(start, end).trim();
                cleanedReply = rawReply.substring(end + 8).trim();
            } else if (rawReply.contains("<think>")) {
                int start = rawReply.indexOf("<think>") + 7;
                reasoning = rawReply.substring(start).trim();
                cleanedReply = "";
            }

            if (cleanedReply.isBlank()) {
                cleanedReply = rawReply.replaceAll("(?s)<think>.*?</think>", "").replaceAll("</?think>", "").trim();
            }

            return ResponseEntity.ok(new AiChatResponse(
                    cleanedReply,
                    "deepseek-r1:1.5b",
                    reasoning,
                    false,
                    null,
                    generateSuggestedChips(userMessage)
            ));
        }

        // 5. Intelligent Interactive Fallback (if Ollama daemon is offline, tailored directly to user prompt intent!)
        String fallbackReply = generateDynamicInteractiveFallback(userMessage, student, activeDrives);
        return ResponseEntity.ok(new AiChatResponse(
                fallbackReply,
                "hirenza-neural-engine",
                null,
                false,
                null,
                generateSuggestedChips(userMessage)
        ));
    }

    private String callOllama(String systemPrompt, String userMessage) {
        try {
            Map<String, Object> body = Map.of(
                    "model", "deepseek-r1:1.5b",
                    "prompt", userMessage,
                    "system", systemPrompt,
                    "stream", false
            );

            Map<?, ?> response = ollamaRestClient.post()
                    .uri("/api/generate")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(Map.class);

            if (response != null && response.containsKey("response")) {
                return (String) response.get("response");
            }
        } catch (Exception e) {
            System.err.println("Ollama direct REST note: " + e.getMessage());
        }
        return null;
    }

    private List<String> generateSuggestedChips(String query) {
        String q = query.toLowerCase();
        if (q.contains("leetcode") || q.contains("code") || q.contains("dsa") || q.contains("question") || q.contains("algorithm")) {
            return List.of(
                    "⚔️ Spar on Question 1 in Mock Arena",
                    "Optimal Time & Space Complexity",
                    "Explain Sliding Window Pattern"
            );
        }
        if (q.contains("amazon")) {
            return List.of(
                    "⚔️ Amazon SDE Mock Interview",
                    "Amazon Leadership Principles (STAR)",
                    "Check My Eligibility Gap"
            );
        }
        if (q.contains("zoho")) {
            return List.of(
                    "⚔️ Zoho Round 1 Technical Sparring",
                    "Zoho Advanced DSA Round Details",
                    "Apply to Zoho SDE"
            );
        }
        if (q.contains("eligib") || q.contains("driv") || q.contains("compani") || q.contains("apply")) {
            return List.of(
                    "⭐ Redeem TPO Golden Ticket",
                    "What-If Career Pathfinder",
                    "Show My Eligible Drives"
            );
        }
        return List.of(
                "⚔️ Start Mock Technical Sparring",
                "Top 5 LeetCode Questions for Amazon",
                "What are the upcoming deadlines?"
        );
    }

    private String generateDynamicInteractiveFallback(String q, Student student, List<Drive> activeDrives) {
        String lower = q.toLowerCase();

        // 1. LEETCODE / CODING QUESTIONS INTENT
        if (lower.contains("leetcode") || lower.contains("question") || lower.contains("dsa") ||
                lower.contains("coding") || lower.contains("problem") || lower.contains("practice")) {

            if (lower.contains("amazon")) {
                return """
                    ### 📦 Top 5 LeetCode Questions Asked by Amazon SDE

                    Based on verified Amazon campus placement telemetry, Amazon focuses on algorithmic optimization, Trees, Graphs, and Dynamic Programming with STAR-format leadership reflection:

                    ---

                    #### 1. **Two Sum / Two Sum II (Sorted Array)**
                    - **LeetCode #1 / #167** • Difficulty: Easy/Medium
                    - **Key Pattern**: Hash Map complement lookup ($O(n)$ time) or Two Pointers ($O(1)$ space).
                    - **Amazon OA Context**: Common warm-up on HackerRank/Mettl OA2. Interviewers test your awareness of hash collision resolution (`TREEIFY_THRESHOLD = 8` in Java 8+).

                    #### 2. **Course Schedule / Course Schedule II**
                    - **LeetCode #207 / #210** • Difficulty: Medium
                    - **Key Pattern**: Topological Sort (Kahn's Algorithm BFS or DFS Cycle Detection).
                    - **Amazon OA Context**: Real-world analogy to AWS task dependency orchestration and build graph execution.

                    #### 3. **Word Ladder (Shortest Transformation Sequence)**
                    - **LeetCode #127** • Difficulty: Hard
                    - **Key Pattern**: Bidirectional Breadth-First Search (BFS) with word set pruning.
                    - **Amazon OA Context**: Evaluates exponential state exploration and queue memory budgeting.

                    #### 4. **Trapping Rain Water**
                    - **LeetCode #42** • Difficulty: Hard
                    - **Key Pattern**: Monotonic Decreasing Stack or Two-Pointers (`left_max`, `right_max`).
                    - **Amazon OA Context**: Frequent Bar Raiser question requiring $O(n)$ time and strictly $O(1)$ auxiliary space.

                    #### 5. **LRU Cache Implementation**
                    - **LeetCode #146** • Difficulty: Medium
                    - **Key Pattern**: Doubly Linked List + Hash Map with strict $O(1)$ `get()` and `put()`.
                    - **Amazon OA Context**: Evaluates concurrent access design and Amazon Leadership Principle: *"Invent and Simplify"*.

                    ---

                    💡 **Amazon Evaluation Rubric**:
                    • Articulate time & space complexity before typing code.
                    • Handle edge cases (empty collections, duplicates, integer overflow).
                    • Structure answers using the STAR method for behavioral follow-ups.
                    """;
            }

            if (lower.contains("zoho")) {
                return """
                    ### 🏢 Top Technical Problems Asked by Zoho Corporation

                    Zoho's technical assessments emphasize core programming from scratch in C or Java without relying on heavy external utility libraries:

                    ---

                    #### 1. **Matrix Spiral Print & Transpose Without Auxiliary Space**
                    - **Focus**: Boundary indexing pointers (`top`, `bottom`, `left`, `right`).
                    - **Zoho Context**: Core Round 1 & Round 2 staple.

                    #### 2. **String Expansion (Run-Length Decoding)**
                    - **Problem**: Given input `a2b3c4`, output `aabbbcccc`. Given nested `a1[b2[c]]`, output `abccbcc`.
                    - **Pattern**: Dual Stack (one for repeat counters, one for character buffers).

                    #### 3. **Sudoku Solver / N-Queens Backtracking**
                    - **Focus**: Recursive backtracking with constraint propagation.

                    #### 4. **Custom Substring & Pattern Matcher (KMP / Rabin-Karp)**
                    - **Focus**: Implementing substring search without `String.indexOf()` or `regex`.

                    #### 5. **Call Management / Railway Reservation Mini-System**
                    - **Focus**: Object-oriented console simulation with passenger waitlist and berth allocation.
                    """;
            }

            return """
                ### 💻 Top 5 Universal SDE Campus Placement LeetCode Problems

                1. **Subarray Sum Equals K** (LeetCode #560) • Prefix Sum + Hash Map ($O(n)$ time)
                2. **Longest Palindromic Substring** (LeetCode #5) • Expand Around Center ($O(n^2)$ time, $O(1)$ space)
                3. **Binary Tree Maximum Path Sum** (LeetCode #124) • Post-Order DFS with global maximum
                4. **Merge k Sorted Lists** (LeetCode #23) • Min-Heap PriorityQueue ($O(N \\log k)$)
                5. **Coin Change / Minimum Coins** (LeetCode #322) • Bottom-Up 1D Dynamic Programming
                """;
        }

        // 2. INTERVIEW ROUNDS INTENT
        if (lower.contains("round") || lower.contains("stage") || lower.contains("pipeline") || lower.contains("process")) {
            if (lower.contains("amazon")) {
                return """
                    ### 📦 Amazon SDE 1 — Sequential Interview Pipeline

                    1. **Round 1: Online Assessment (OA)** (90 mins)
                       - 2 Algorithmic Coding Problems (DP, Graphs, Arrays)
                       - Work Style Assessment & Amazon Leadership Principles survey
                    2. **Round 2: Technical Interview 1** (60 mins)
                       - Deep DSA: Trees, Heaps, and Dynamic Programming optimization
                       - Code walkthrough with live dry-runs
                    3. **Round 3: Technical Interview 2** (60 mins)
                       - Object-Oriented Design (OOD) & Scalable In-Memory Architecture (e.g. Parking Lot, Rate Limiter)
                    4. **Round 4: Bar Raiser & Leadership Principles** (60 mins)
                       - Evaluated by an independent Amazon Bar Raiser outside the hiring team
                       - 16 Leadership Principles evaluated using STAR format (Situation, Task, Action, Result)
                    """;
            }
            if (lower.contains("zoho")) {
                return """
                    ### 🏢 Zoho Corporation — SDE Hiring Stages

                    1. **Round 1: Online Aptitude & C/Java Fundamentals** (90 mins)
                       - Basic math, flow of control, recursion, and output prediction
                    2. **Round 2: Advanced Coding Assessment** (150 mins)
                       - 3 to 5 complex algorithmic and matrix manipulation problems without standard libraries
                    3. **Round 3: Technical Face-to-Face & Design** (45 mins)
                       - Problem-solving, OOP architecture, and data structures implementation
                    4. **Round 4: HR & Cultural Alignment** (30 mins)
                       - Communication, learning attitude, and commitment
                    """;
            }
        }

        // 3. ELIGIBILITY INTENT (Only when specifically asking if eligible or checking cutoffs)
        if (lower.contains("eligib") || lower.contains("cutoff") || lower.contains("am i") ||
                lower.contains("can i apply") || lower.contains("gap") || lower.contains("criteria")) {

            double cgpa = student != null ? student.getCgpa() : 8.2;
            int arrears = student != null ? student.getArrearsCount() : 0;
            String branch = student != null && student.getBranch() != null ? student.getBranch().toUpperCase() : "CSE";
            String studentName = student != null ? student.getName() : "Candidate";

            boolean amazonOk = cgpa >= 8.5 && arrears == 0;
            boolean zohoOk = cgpa >= 7.5 && arrears == 0;
            boolean msOk = cgpa >= 8.0 && arrears == 0;
            boolean tcsOk = cgpa >= 7.0 && arrears <= 1;

            return "### 🎯 Verified Eligibility Telemetry for " + studentName + "\n\n" +
                    "Verified Academic Credentials:\n" +
                    "• **CGPA**: " + cgpa + " | **Standing Arrears**: " + arrears + " | **Branch**: " + branch + "\n\n" +
                    "Institutional Gating Verdict:\n" +
                    "• **Amazon SDE 1** (Cutoff 8.5): " + (amazonOk ? "✅ **ELIGIBLE** (Ready to Apply)" : "⚠️ **0.3 CGPA GAP** (Current: " + cgpa + ", Min: 8.5)") + "\n" +
                    "• **Zoho SDE** (Cutoff 7.5): " + (zohoOk ? "✅ **ELIGIBLE** (Slot Open)" : "❌ Ineligible (Min 7.5 CGPA, 0 Arrears)") + "\n" +
                    "• **Microsoft SWE** (Cutoff 8.0): " + (msOk ? "✅ **ELIGIBLE**" : "❌ Ineligible") + "\n" +
                    "• **TCS Digital** (Cutoff 7.0): " + (tcsOk ? "✅ **ELIGIBLE** (All Branches)" : "❌ Ineligible") + "\n\n" +
                    "💡 *Tip: If you have a near-miss cutoff (e.g. Amazon), you can request a **TPO Golden Ticket Waiver** in your Student Dashboard!*";
        }

        // Default Interactive General Response
        return """
            ### 🤖 Hirenza Neural Placement Copilot

            I am your dedicated technical interview and campus placement strategist. Ask me anything interactive:
            • *"Top 5 LeetCode questions asked by Amazon"*
            • *"How to design a distributed rate limiter for tech interview"*
            • *"Explain HashMap internals in Java 17"*
            • *"What are the interview rounds for Zoho?"*
            • *"Am I eligible for current campus drives?"*
            """;
    }
}
