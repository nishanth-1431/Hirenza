package com.hirenza.service;

import com.hirenza.domain.InterviewAutopsy;
import com.hirenza.repository.InterviewAutopsyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AutopsyService {

    private final InterviewAutopsyRepository autopsyRepository;

    public AutopsyService(InterviewAutopsyRepository autopsyRepository) {
        this.autopsyRepository = autopsyRepository;
    }

    @Transactional(readOnly = true)
    public List<InterviewAutopsy> getStudentAutopsies(Long studentId) {
        List<InterviewAutopsy> list = autopsyRepository.findByStudentIdOrderByEvaluatedAtDesc(studentId);
        if (list.isEmpty()) {
            // Seed sample autopsies for interactive demonstration
            seedSampleAutopsies(studentId);
            return autopsyRepository.findByStudentIdOrderByEvaluatedAtDesc(studentId);
        }
        return list;
    }

    @Transactional
    public InterviewAutopsy recordAutopsy(InterviewAutopsy autopsy) {
        return autopsyRepository.save(autopsy);
    }

    private void seedSampleAutopsies(Long studentId) {
        InterviewAutopsy a1 = new InterviewAutopsy(
                studentId,
                "Amazon",
                "SDE 1 (Campus)",
                "Round 2: Technical Interview (DSA & Trees)",
                82,
                "REJECTED",
                "Graph traversals (BFS/DFS), Clean modular Java, Hash table optimizations",
                "Dynamic Programming space optimization, Concurrency locks & synchronization",
                "You solved the Binary Tree lowest common ancestor cleanly in O(N) time. However, in the 0/1 Knapsack problem, you struggled to optimize the DP table from 2D to 1D array space. Practice DP state transitions with space reduction.",
                "Solve 3 LeetCode Medium Dynamic Programming problems (Coin Change, Partition Equal Subset Sum, Target Sum)."
        );

        InterviewAutopsy a2 = new InterviewAutopsy(
                studentId,
                "Zoho Corporation",
                "Software Development Engineer",
                "Round 1: Advanced Programming & Aptitude",
                94,
                "CLEARED",
                "Matrix spiral traversal, Recursion, Fast bitwise manipulation, Time complexity analysis",
                "Edge-case boundary testing (Integer overflow in arithmetic)",
                "Exceptional algorithmic speed. Scored in the top 6% of candidates for test case coverage and time-to-completion.",
                "Review System Design fundamentals: Load balancing, caching with Redis, and DB indexing before Round 2."
        );

        autopsyRepository.saveAll(List.of(a1, a2));
    }
}
