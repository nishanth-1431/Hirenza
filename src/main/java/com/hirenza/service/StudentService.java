package com.hirenza.service;

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
                request.getPassword() // Needs BCrypt in real flow, but we'll do this in AuthService shortly
        );
        student = studentRepository.save(student);
        return mapToResponse(student);
    }

    public StudentResponse getStudent(Long id) {
        return studentRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    private StudentResponse mapToResponse(Student student) {
        return new StudentResponse(
                student.getId(), student.getName(), student.getEmail(),
                student.getPhone(), student.getCgpa(), student.getBranch(),
                student.getArrearsCount()
        );
    }
}
