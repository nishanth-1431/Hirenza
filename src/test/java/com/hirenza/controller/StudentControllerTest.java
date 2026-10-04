package com.hirenza.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hirenza.dto.DriveResponse;
import com.hirenza.dto.StudentRequest;
import com.hirenza.dto.StudentResponse;
import com.hirenza.service.DriveService;
import com.hirenza.service.StudentService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import com.hirenza.security.JwtUtil;

@WebMvcTest(StudentController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import({JwtUtil.class})
public class StudentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private StudentService studentService;

    @MockBean
    private DriveService driveService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testRegisterStudent() throws Exception {
        StudentRequest req = new StudentRequest();
        req.setName("Test Student");
        req.setEmail("test@test.com");

        StudentResponse res = new StudentResponse();
        res.setId(1L);
        res.setName("Test Student");

        Mockito.when(studentService.registerStudent(any(StudentRequest.class))).thenReturn(res);

        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Test Student"));
    }

    @Test
    void testGetEligibleDrives_ReturnsDrives() throws Exception {
        DriveResponse drive1 = new DriveResponse();
        drive1.setId(101L);
        drive1.setCompanyName("Zoho");
        drive1.setEligible(true);

        Mockito.when(driveService.getEligibleDrives(1L)).thenReturn(List.of(drive1));

        mockMvc.perform(get("/api/students/1/eligible-drives"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].companyName").value("Zoho"));
    }

    @Test
    void testGetEligibleDrives_ReturnsZero() throws Exception {
        Mockito.when(driveService.getEligibleDrives(2L)).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/students/2/eligible-drives"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }
}
