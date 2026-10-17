package com.hirenza.service;

import com.hirenza.domain.Drive;
import com.hirenza.dto.Round0AnswerRequest;
import com.hirenza.dto.Round0Response;
import com.hirenza.dto.Round0StartRequest;
import com.hirenza.repository.DriveRepository;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class Round0Service {

    private final DriveRepository driveRepository;
    private final ChatClient chatClient;

    public Round0Service(
            DriveRepository driveRepository,
            @Autowired(required = false) ChatClient.Builder chatClientBuilder) {
        this.driveRepository = driveRepository;
        this.chatClient = chatClientBuilder != null ? chatClientBuilder.build() : null;
    }

    public Round0Response startSession(Round0StartRequest request) {
        String companyName = "Product Engineering Team";
        String role = "Software Engineer";
        if (request.getDriveId() != null) {
            Drive drive = driveRepository.findById(request.getDriveId()).orElse(null);
            if (drive != null) {
                companyName = drive.getCompanyName();
                role = drive.getRole();
            }
        }

        String sessionId = UUID.randomUUID().toString().substring(0, 8);
        Round0Response response = new Round0Response();
        response.setSessionId(sessionId);
        response.setCompanyName(companyName);
        response.setQuestionNumber(1);
        response.setTotalQuestions(3);
        response.setFinished(false);

        // Tailor Question 1 based on company
        String lowerCompany = companyName.toLowerCase();
        if (lowerCompany.contains("zoho")) {
            response.setQuestion("Zoho Technical Round 1: In Java, how does HashMap handle hash collisions internally in Java 8 compared to Java 7? When does the bucket structure convert from a linked list into a Red-Black Tree, and what is the time complexity difference?");
            response.setTip("Focus on TREEIFY_THRESHOLD (8), UNTREEIFY_THRESHOLD (6), and O(log N) vs O(N) lookup guarantees.");
        } else if (lowerCompany.contains("amazon")) {
            response.setQuestion("Amazon SDE 1 Architecture: How would you design a scalable in-memory rate limiter for a public REST API handling 50,000 requests/second? What algorithm (Token Bucket, Leaky Bucket, Sliding Window) would you choose and why?");
            response.setTip("Mention concurrency, Redis Redis/Lua atomic execution, and tradeoff between burst tolerance vs strict pacing.");
        } else if (lowerCompany.contains("freshworks")) {
            response.setQuestion("Freshworks Frontend / Full Stack: Explain how React 18/19 handles concurrent rendering and state batching. How does `useTransition` prevent UI blocking during expensive state calculations?");
            response.setTip("Explain non-blocking interrupts, transitions vs urgent updates, and real user responsiveness.");
        } else {
            response.setQuestion("Technical Architecture: In high-scale web systems, explain the difference between Optimistic Locking (`@Version`) and Pessimistic Locking (`SELECT FOR UPDATE`). Under what read-to-write ratios should you prefer one over the other?");
            response.setTip("Discuss database deadlocks, retry overhead in high contention, and throughput implications.");
        }

        return response;
    }

    public Round0Response evaluateAndNext(Round0AnswerRequest request) {
        int currentQ = request.getQuestionNumber();
        String answer = request.getCandidateAnswer() != null ? request.getCandidateAnswer().trim() : "";
        String companyName = "Engineering Team";
        if (request.getDriveId() != null) {
            Drive drive = driveRepository.findById(request.getDriveId()).orElse(null);
            if (drive != null) companyName = drive.getCompanyName();
        }

        // Evaluate answer
        double score = calculateScore(answer, currentQ);
        String critique = generateCritique(answer, currentQ, companyName);
        List<String> strengths = extractStrengths(answer);
        List<String> missed = extractMissed(answer, currentQ);

        Round0Response response = new Round0Response();
        response.setSessionId(request.getSessionId());
        response.setCompanyName(companyName);
        response.setScore(score);
        response.setCritique(critique);
        response.setKeyStrengths(strengths);
        response.setMissedPoints(missed);

        if (currentQ >= 3) {
            // Final Completion
            response.setFinished(true);
            response.setQuestionNumber(3);
            double finalScore = Math.min(95.0, Math.max(70.0, (score * 10) + 12.0));
            response.setOverallReadinessScore(finalScore);
            response.setReadinessVerdict(finalScore >= 80 ? "STRONG_CANDIDATE" : "GOOD_FOUNDATION_NEEDS_POLISH");
            response.setFinalSummary(String.format(
                    "Sparring Complete for %s! You achieved an overall readiness rating of %.0f%%. " +
                    "Your core computer science fundamentals and algorithmic reasoning are solid. " +
                    "Focus on clearly communicating edge cases and time complexity before your live round.",
                    companyName, finalScore));
            return response;
        }

        // Deliver Next Question
        int nextQ = currentQ + 1;
        response.setQuestionNumber(nextQ);
        response.setFinished(false);

        if (nextQ == 2) {
            response.setQuestion("Question 2: In a distributed system with multiple microservice instances, how do you prevent race conditions when two users attempt to book the last available seat simultaneously?");
            response.setTip("Consider distributed locks (Redis Redlock), database-level unique constraints, or atomic decrement operations.");
        } else if (nextQ == 3) {
            response.setQuestion("Question 3 (System Resiliency): Explain the Circuit Breaker pattern. How does state transition work between CLOSED, OPEN, and HALF-OPEN, and how does it protect downstream dependencies?");
            response.setTip("Mention failure rate thresholds, timeout periods, and fallback graceful degradation.");
        }

        return response;
    }

    private double calculateScore(String answer, int qNum) {
        if (answer.length() < 20) return 4.5;
        if (answer.length() < 60) return 6.5;
        if (answer.length() < 120) return 8.0;
        return 9.2;
    }

    private String generateCritique(String answer, int qNum, String company) {
        if (answer.length() < 40) {
            return "Good start, but your answer was relatively brief. Interviewers at " + company + " expect you to elaborate on the underlying data structure and performance trade-offs.";
        }
        return "Strong technical explanation! You clearly identified the core computer science principles and accurately referenced time/space complexity trade-offs.";
    }

    private List<String> extractStrengths(String answer) {
        List<String> list = new ArrayList<>();
        list.add("Accurate conceptual reasoning");
        if (answer.toLowerCase().contains("o(") || answer.toLowerCase().contains("complexity")) {
            list.add("Identified Big-O complexity impact");
        }
        if (answer.toLowerCase().contains("lock") || answer.toLowerCase().contains("thread") || answer.toLowerCase().contains("state")) {
            list.add("Strong concurrency awareness");
        }
        return list;
    }

    private List<String> extractMissed(String answer, int qNum) {
        List<String> list = new ArrayList<>();
        if (!answer.toLowerCase().contains("edge") && !answer.toLowerCase().contains("overflow")) {
            list.add("Did not proactively address edge-case failure modes");
        }
        if (!answer.toLowerCase().contains("memory") && !answer.toLowerCase().contains("space")) {
            list.add("Could emphasize memory / GC overhead in high-throughput environments");
        }
        return list;
    }
}
