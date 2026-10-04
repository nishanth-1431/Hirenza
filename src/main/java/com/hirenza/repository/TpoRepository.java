package com.hirenza.repository;

import com.hirenza.domain.TPO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;

@Repository
public interface TpoRepository extends JpaRepository<TPO, Long> {
    Optional<TPO> findByEmail(String email);

    @Modifying
    @Query("UPDATE TPO t SET t.otpRequestsToday = 0")
    void resetOtpRequests();
}
