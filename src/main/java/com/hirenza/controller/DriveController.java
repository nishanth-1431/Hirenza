package com.hirenza.controller;

import com.hirenza.dto.DriveRequest;
import com.hirenza.dto.DriveResponse;
import com.hirenza.service.DriveService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drives")
public class DriveController {

    private final DriveService driveService;

    public DriveController(DriveService driveService) {
        this.driveService = driveService;
    }

    @PostMapping
    public ResponseEntity<DriveResponse> createDrive(@RequestBody DriveRequest request) {
        return ResponseEntity.ok(driveService.createDrive(request));
    }

    @GetMapping
    public ResponseEntity<List<DriveResponse>> getAllDrives() {
        return ResponseEntity.ok(driveService.getAllDrives());
    }
}
