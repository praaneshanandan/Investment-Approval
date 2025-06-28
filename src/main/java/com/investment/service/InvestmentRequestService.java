package com.investment.service;

import com.investment.dto.InvestmentRequestDto;
import com.investment.dto.InvestmentResponseDto;

import java.util.List;

public interface InvestmentRequestService {
    InvestmentResponseDto createInvestmentRequest(InvestmentRequestDto investmentRequestDto);

    List<InvestmentResponseDto> getUserInvestmentRequests();

    List<InvestmentResponseDto> getManagedInvestmentRequests();

    List<InvestmentResponseDto> getEscalatedInvestmentRequests();

    List<InvestmentResponseDto> getAllInvestmentRequests(); // New method for admins

    InvestmentResponseDto approveInvestmentRequest(Long id);

    InvestmentResponseDto rejectInvestmentRequest(Long id);

    InvestmentResponseDto escalateInvestmentRequest(Long id);
}
