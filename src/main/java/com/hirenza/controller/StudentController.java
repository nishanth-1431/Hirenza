package com.hirenza.controller;

import com.hirenza.dto.DriveResponse;
import com.hirenza.dto.StudentRequest;
import com.hirenza.dto.StudentResponse;
import com.hirenza.service.DriveService;
import com.hirenza.service.MatchService;
import com.hirenza.service.ResumeService;
import com.hirenza.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;
    private final DriveService driveService;
    private final MatchService matchService;
    private final ResumeService resumeService;

    public StudentController(StudentService studentService, 
                             DriveService driveService,
                             MatchService matchService,
                             ResumeService resumeService) {
        this.studentService = studentService;
        this.driveService = driveService;
        this.matchService = matchService;
        this.resumeService = resumeService;
    }

    @PostMapping
    public ResponseEntity<StudentResponse> register(@RequestBody StudentRequest request) {
        return ResponseEntity.ok(studentService.registerStudent(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentResponse> getStudent(@PathVariable("id") Long id) {
        return ResponseEntity.ok(studentService.getStudent(id));
    }

    // Endpoint returning all drives a given student is eligible for
    @GetMapping("/{id}/eligible-drives")
    public ResponseEntity<List<DriveResponse>> getEligibleDrives(@PathVariable("id") Long id) {
        return ResponseEntity.ok(driveService.getEligibleDrives(id));
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
