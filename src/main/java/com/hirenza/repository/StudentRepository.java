package com.hirenza.repository;

import com.hirenza.domain.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByEmail(String email);

    @Modifying
    @Query("UPDATE Student s SET s.otpRequestsToday = 0")
    void resetOtpRequests();
}
