package com.hirenza.service;

import com.hirenza.domain.Drive;
import com.hirenza.domain.Resume;
import com.hirenza.domain.Student;
import com.hirenza.dto.DriveResponse;
import com.hirenza.repository.DriveRepository;
import com.hirenza.repository.ResumeRepository;
import com.hirenza.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MatchService {

    private final ResumeRepository resumeRepository;
    private final DriveRepository driveRepository;
    private final DriveService driveService;

    public MatchService(ResumeRepository resumeRepository, DriveRepository driveRepository, DriveService driveService) {
        this.resumeRepository = resumeRepository;
        this.driveRepository = driveRepository;
        this.driveService = driveService;
    }

    public List<DriveMatchDto> getEligibleDrivesRanked(Long studentId) {
        // 1. Get student's resume
        Resume resume = resumeRepository.findByStudentId(studentId)
                .orElseThrow(() -> new IllegalArgumentException("No resume found for student"));

        if (resume.getEmbedding() == null) {
            throw new IllegalStateException("Resume has no embedding generated yet.");
        }

        // 2. Get eligible drives (based on hard rules)
        List<DriveResponse> eligibleDrivesResponses = driveService.getEligibleDrives(studentId);
        
        // Convert back to Drives to access embeddings (in reality, DriveService should return DTOs with embeddings or we map them)
        List<DriveMatchDto> matches = new ArrayList<>();
        
        for (DriveResponse response : eligibleDrivesResponses) {
            Drive drive = driveRepository.findById(response.getId()).orElse(null);
            if (drive != null && drive.getEmbedding() != null) {
                double score = cosineSimilarity(resume.getEmbedding(), drive.getEmbedding());
                matches.add(new DriveMatchDto(response, score));
            }
        }

        // 3. Sort by score descending
        matches.sort((a, b) -> Double.compare(b.getScore(), a.getScore()));
        
        return matches;
    }

    private double cosineSimilarity(List<Double> vectorA, List<Double> vectorB) {
        if (vectorA.size() != vectorB.size()) {
            throw new IllegalArgumentException("Vectors must be the same length");
        }
        
        double dotProduct = 0.0;
        double normA = 0.0;
        double normB = 0.0;
        
        for (int i = 0; i < vectorA.size(); i++) {
            dotProduct += vectorA.get(i) * vectorB.get(i);
            normA += Math.pow(vectorA.get(i), 2);
            normB += Math.pow(vectorB.get(i), 2);
        }
        
        if (normA == 0 || normB == 0) return 0.0;
        
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    public static class DriveMatchDto {
        private DriveResponse drive;
        private double score;

        public DriveMatchDto(DriveResponse drive, double score) {
            this.drive = drive;
            this.score = score;
        }

        public DriveResponse getDrive() { return drive; }
        public double getScore() { return score; }
    }
}
