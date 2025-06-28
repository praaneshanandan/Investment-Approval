package com.investment.repository;

import com.investment.entity.InvestmentRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface InvestmentRequestRepository extends JpaRepository<InvestmentRequest, Long> {

    List<InvestmentRequest> findByUserId(Long userId);

    @Query("SELECT ir FROM InvestmentRequest ir WHERE ir.user.manager.id = :managerId")
    List<InvestmentRequest> findByUserManagerId(@Param("managerId") Long managerId);

    List<InvestmentRequest> findByStatus(InvestmentRequest.Status status);
}
