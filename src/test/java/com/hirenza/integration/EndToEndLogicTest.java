package com.hirenza.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hirenza.controller.ApplicationController;
import com.hirenza.controller.DriveController;
import com.hirenza.controller.StudentController;
import com.hirenza.domain.Application;
import com.hirenza.domain.Drive;
import com.hirenza.domain.EligibilityRule;
import com.hirenza.domain.Student;
import com.hirenza.dto.ApplicationRequest;
import com.hirenza.engine.EligibilityEvaluator;
import com.hirenza.repository.ApplicationRepository;
import com.hirenza.repository.DriveRepository;
import com.hirenza.repository.StudentRepository;
import com.hirenza.service.ApplicationService;
import com.hirenza.service.DriveService;
import com.hirenza.service.StudentService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import com.hirenza.security.JwtUtil;

@WebMvcTest(controllers = {StudentController.class, ApplicationController.class})
@AutoConfigureMockMvc(addFilters = false)
@Import({DriveService.class, ApplicationService.class, StudentService.class, EligibilityEvaluator.class, JwtUtil.class})
public class EndToEndLogicTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // We mock the DB layer because Docker might not be running on your machine,
    // but we use the REAL Services, REAL Evaluator, and REAL Controllers!
    @MockBean
    private StudentRepository studentRepository;

    @MockBean
    private DriveRepository driveRepository;

    @MockBean
    private ApplicationRepository applicationRepository;

    @Test
    void testEndToEndEligibilityAndApplication() throws Exception {
        // 1. Setup our mock database records
        Student student = new Student("Nishanth", "test@test.com", "123", 8.0, "CSE", 0, "pass123");
        // Reflection or setter to set ID if needed, but mocked repo handles it mostly.
        
        Drive eligibleDrive = Drive.builder()
                .companyName("Zoho")
                .role("SDE")
                .applicationDeadline(LocalDate.now().plusDays(10))
                .cgpaCutoff(7.5) // Student has 8.0 (Pass)
                .build();
                
        Drive ineligibleDrive = Drive.builder()
                .companyName("Amazon")
                .role("SDE")
                .applicationDeadline(LocalDate.now().plusDays(10))
                .cgpaCutoff(8.5) // Student has 8.0 (Fail)
                .build();

        Mockito.when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        Mockito.when(driveRepository.findAll()).thenReturn(List.of(eligibleDrive, ineligibleDrive));
        Mockito.when(driveRepository.findById(101L)).thenReturn(Optional.of(eligibleDrive));
        Mockito.when(driveRepository.findById(102L)).thenReturn(Optional.of(ineligibleDrive));
        
        // Mock saving the application
        Mockito.when(applicationRepository.save(any(Application.class))).thenAnswer(i -> {
            Application app = i.getArgument(0);
            return app; // In reality ID would be generated
        });

        // 2. Test GET /api/students/1/eligible-drives
        // It should route through the controller, service, and evaluator and ONLY return Zoho.
        mockMvc.perform(get("/api/students/1/eligible-drives"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].companyName").value("Zoho"))
                .andExpect(jsonPath("$[0].eligible").value(true));

        // 3. Test POST /api/applications (Applying for the ELIGIBLE drive)
        ApplicationRequest reqPass = new ApplicationRequest();
        reqPass.setStudentId(1L);
        reqPass.setDriveId(101L); // Zoho

        mockMvc.perform(post("/api/applications")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reqPass)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.companyName").value("Zoho"))
                .andExpect(jsonPath("$.status").value("APPLIED"));

        // 4. Test POST /api/applications (Applying for the INELIGIBLE drive)
        ApplicationRequest reqFail = new ApplicationRequest();
        reqFail.setStudentId(1L);
        reqFail.setDriveId(102L); // Amazon

        mockMvc.perform(post("/api/applications")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reqFail)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Cannot apply: Student CGPA 8.00 is below the required minimum of 8.50"));
    }
}
