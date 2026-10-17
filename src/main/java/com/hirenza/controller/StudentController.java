package com.hirenza.controller;

import com.hirenza.domain.InterviewAutopsy;
import com.hirenza.domain.PlacementTier;
import com.hirenza.dto.DriveResponse;
import com.hirenza.dto.StudentRequest;
import com.hirenza.dto.StudentResponse;
import com.hirenza.service.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
public class StudentController {

    private final StudentService studentService;
    private final DriveService driveService;
    private final MatchService matchService;
    private final ResumeService resumeService;
    private final AutopsyService autopsyService;

    public StudentController(StudentService studentService, 
                             DriveService driveService,
                             MatchService matchService,
                             ResumeService resumeService,
                             AutopsyService autopsyService) {
        this.studentService = studentService;
        this.driveService = driveService;
        this.matchService = matchService;
        this.resumeService = resumeService;
        this.autopsyService = autopsyService;
    }

    @PostMapping
    public ResponseEntity<StudentResponse> register(@RequestBody StudentRequest request) {
        return ResponseEntity.ok(studentService.registerStudent(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentResponse> getStudent(@PathVariable("id") Long id) {
        return ResponseEntity.ok(studentService.getStudent(id));
    }

    // Endpoint returning all drives a given student is eligible for (strict filter)
    @GetMapping("/{id}/eligible-drives")
    public ResponseEntity<List<DriveResponse>> getEligibleDrives(@PathVariable("id") Long id) {
        return ResponseEntity.ok(driveService.getEligibleDrives(id));
    }
    
    // "What-If" Career Pathfinder: Returns all drives evaluated with tier status, deficit gap, and waiver availability
    @GetMapping("/{id}/drives-assessment")
    public ResponseEntity<List<DriveResponse>> getDrivesAssessment(@PathVariable("id") Long id) {
        return ResponseEntity.ok(driveService.getEvaluatedDrives(id));
    }

    // Spend 1 TPO Golden Ticket to bypass near-miss eligibility cutoffs
    @PostMapping("/{id}/claim-golden-ticket/{driveId}")
    public ResponseEntity<DriveResponse> claimGoldenTicket(
            @PathVariable("id") Long id,
            @PathVariable("driveId") Long driveId) {
        return ResponseEntity.ok(driveService.claimGoldenTicket(id, driveId));
    }

    // Interview Autopsy & Skill Growth Passport
    @GetMapping("/{id}/autopsies")
    public ResponseEntity<List<InterviewAutopsy>> getStudentAutopsies(@PathVariable("id") Long id) {
        return ResponseEntity.ok(autopsyService.getStudentAutopsies(id));
    }

    // Proof-of-Work GitHub Codebase Verification
    @PostMapping("/{id}/verify-github")
    public ResponseEntity<StudentResponse> verifyGithub(
            @PathVariable("id") Long id,
            @RequestBody Map<String, String> payload) {
        String githubUrl = payload.getOrDefault("githubUrl", "https://github.com/developer/hirenza-project");
        return ResponseEntity.ok(studentService.verifyGithub(id, githubUrl));
    }

    // Institutional Placement Policy Simulation / Status Update
    @PostMapping("/{id}/placement-tier")
    public ResponseEntity<StudentResponse> updatePlacementTier(
            @PathVariable("id") Long id,
            @RequestBody Map<String, Object> payload) {
        String tierStr = (String) payload.getOrDefault("tier", "DREAM_TIER");
        String company = (String) payload.getOrDefault("companyName", "Zoho Corporation");
        Double ctc = payload.get("ctcLpa") != null ? Double.valueOf(payload.get("ctcLpa").toString()) : 8.5;
        PlacementTier tier = PlacementTier.valueOf(tierStr);
        return ResponseEntity.ok(studentService.updatePlacementTier(id, tier, company, ctc));
    }
    
    @GetMapping("/{id}/eligible-drives/ranked")
    public ResponseEntity<List<MatchService.DriveMatchDto>> getEligibleDrivesRanked(@PathVariable("id") Long id) {
        return ResponseEntity.ok(matchService.getEligibleDrivesRanked(id));
    }
    
    @PostMapping("/{id}/resume")
    public ResponseEntity<String> uploadResume(@PathVariable("id") Long id, @RequestBody String rawText) {
        resumeService.processAndSaveResume(id, rawText);
        return ResponseEntity.ok("Resume uploaded and processed successfully.");
    }
}
