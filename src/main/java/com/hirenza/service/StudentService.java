package com.hirenza.service;

import com.hirenza.domain.PlacementTier;
import com.hirenza.domain.Student;
import com.hirenza.dto.StudentRequest;
import com.hirenza.dto.StudentResponse;
import com.hirenza.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Transactional
    public StudentResponse registerStudent(StudentRequest request) {
        Student student = new Student(
                request.getName(),
                request.getEmail(),
                request.getPhone(),
                request.getCgpa(),
                request.getBranch(),
                request.getArrearsCount(),
                request.getPassword()
        );
        student = studentRepository.save(student);
        return mapToResponse(student);
    }

    public StudentResponse getStudent(Long id) {
        return studentRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    @Transactional
    public StudentResponse verifyGithub(Long studentId, String githubUrl) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        student.setGithubUrl(githubUrl);
        student.setCodeVerified(true);
        student.setCodeIntegrityBadge("GitHub Verified • Clean Architecture & JUnit 5");
        student = studentRepository.save(student);
        return mapToResponse(student);
    }

    @Transactional
    public StudentResponse updatePlacementTier(Long studentId, PlacementTier tier, String companyName, Double ctcLpa) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        student.setCurrentPlacedTier(tier);
        student.setPlacedCompanyName(companyName);
        student.setPlacedCtcLpa(ctcLpa);
        student = studentRepository.save(student);
        return mapToResponse(student);
    }

    private StudentResponse mapToResponse(Student student) {
        StudentResponse response = new StudentResponse(
                student.getId(), student.getName(), student.getEmail(),
                student.getPhone(), student.getCgpa(), student.getBranch(),
                student.getArrearsCount()
        );
        if (student.getCurrentPlacedTier() != null) {
            response.setCurrentPlacedTier(student.getCurrentPlacedTier().name());
        }
        response.setPlacedCompanyName(student.getPlacedCompanyName());
        response.setPlacedCtcLpa(student.getPlacedCtcLpa());
        response.setGoldenTicketsRemaining(student.getGoldenTicketsRemaining());
        response.setGoldenTicketDriveId(student.getGoldenTicketDriveId());
        response.setGithubUrl(student.getGithubUrl());
        response.setCodeVerified(student.isCodeVerified());
        response.setCodeIntegrityBadge(student.getCodeIntegrityBadge());
        return response;
    }
}
