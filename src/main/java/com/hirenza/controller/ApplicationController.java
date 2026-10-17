package com.hirenza.controller;

import com.hirenza.domain.ApplicationStatus;
import com.hirenza.dto.ApplicationRequest;
import com.hirenza.dto.ApplicationResponse;
import com.hirenza.service.ApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    public ResponseEntity<ApplicationResponse> apply(@RequestBody ApplicationRequest request) {
        return ResponseEntity.ok(applicationService.applyForDrive(request));
    }

    @PostMapping("/apply")
    public ResponseEntity<ApplicationResponse> applyWithParams(
            @RequestParam("studentId") Long studentId,
            @RequestParam("driveId") Long driveId) {
        ApplicationRequest request = new ApplicationRequest();
        request.setStudentId(studentId);
        request.setDriveId(driveId);
        return ResponseEntity.ok(applicationService.applyForDrive(request));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApplicationResponse> updateStatus(
            @PathVariable("id") Long id,
            @RequestParam("status") String status) {
        return ResponseEntity.ok(applicationService.updateApplicationStatus(id, ApplicationStatus.valueOf(status)));
    }
}
