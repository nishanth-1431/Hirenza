package com.hirenza.integration;

import com.hirenza.domain.Application;
import com.hirenza.domain.ApplicationStatus;
import com.hirenza.domain.Drive;
import com.hirenza.domain.Student;
import com.hirenza.repository.ApplicationRepository;
import com.hirenza.repository.DriveRepository;
import com.hirenza.repository.StudentRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Disabled;

@DataJpaTest
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Disabled("Docker environment not reliably detected on Windows by Testcontainers")
public class StudentApplicationIntegrationTest {

    @Container
    @ServiceConnection
    static MySQLContainer<?> mysql = new MySQLContainer<>("mysql:8.0.32");

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private DriveRepository driveRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Test
    void testSaveAndLoadStudentWithApplication() {
        // Given
        Student student = new Student("Nishanth", "nishanth@test.com", "1234567890", 8.5, "CSE", 0);
        student = studentRepository.save(student);

        Drive drive = Drive.builder()
                .companyName("Zoho")
                .role("SDE")
                .applicationDeadline(LocalDate.now().plusDays(10))
                .cgpaCutoff(7.5)
                .build();
        drive = driveRepository.save(drive);

        Application application = new Application(student, drive);
        application = applicationRepository.save(application);

        // When
        Optional<Student> loadedStudentOpt = studentRepository.findById(student.getId());

        // Then
        assertThat(loadedStudentOpt).isPresent();
        Student loadedStudent = loadedStudentOpt.get();
        assertThat(loadedStudent.getName()).isEqualTo("Nishanth");
        
        // Let's also verify we can fetch the application directly
        Optional<Application> loadedAppOpt = applicationRepository.findById(application.getId());
        assertThat(loadedAppOpt).isPresent();
        Application loadedApp = loadedAppOpt.get();
        assertThat(loadedApp.getStudent().getId()).isEqualTo(student.getId());
        assertThat(loadedApp.getDrive().getCompanyName()).isEqualTo("Zoho");
        assertThat(loadedApp.getStatus()).isEqualTo(ApplicationStatus.APPLIED);
    }
}
