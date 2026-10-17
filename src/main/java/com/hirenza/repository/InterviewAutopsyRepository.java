package com.hirenza.repository;

import com.hirenza.domain.InterviewAutopsy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewAutopsyRepository extends JpaRepository<InterviewAutopsy, Long> {
    List<InterviewAutopsy> findByStudentIdOrderByEvaluatedAtDesc(Long studentId);
}
