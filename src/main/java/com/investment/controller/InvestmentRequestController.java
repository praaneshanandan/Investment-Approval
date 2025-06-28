package com.investment.controller;

import com.investment.dto.InvestmentRequestDto;
import com.investment.dto.InvestmentResponseDto;
import com.investment.dto.ApiResponse;
import com.investment.service.InvestmentRequestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/investments")
public class InvestmentRequestController {

    private final InvestmentRequestService investmentRequestService;

    public InvestmentRequestController(InvestmentRequestService investmentRequestService) {
        this.investmentRequestService = investmentRequestService;
    }

    @PostMapping
    public ResponseEntity<InvestmentResponseDto> createInvestmentRequest(
            @RequestBody InvestmentRequestDto investmentRequestDto) {
        return new ResponseEntity<>(investmentRequestService.createInvestmentRequest(investmentRequestDto),
                HttpStatus.CREATED);
    }

    @GetMapping("/my-requests")
    public ResponseEntity<List<InvestmentResponseDto>> getUserInvestmentRequests() {
        return ResponseEntity.ok(investmentRequestService.getUserInvestmentRequests());
    }

    @GetMapping("/managed-requests")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<InvestmentResponseDto>> getManagedInvestmentRequests() {
        return ResponseEntity.ok(investmentRequestService.getManagedInvestmentRequests());
    }

    @GetMapping("/escalated-requests")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<InvestmentResponseDto>> getEscalatedInvestmentRequests() {
        return ResponseEntity.ok(investmentRequestService.getEscalatedInvestmentRequests());
    }

    // Adding a new endpoint for admins to get all requests
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<InvestmentResponseDto>> getAllInvestmentRequests() {
        // This is a new endpoint we need to implement on the backend
        return ResponseEntity.ok(investmentRequestService.getAllInvestmentRequests());
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<InvestmentResponseDto> approveInvestmentRequest(@PathVariable Long id) {
        return ResponseEntity.ok(investmentRequestService.approveInvestmentRequest(id));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<InvestmentResponseDto> rejectInvestmentRequest(@PathVariable Long id) {
        return ResponseEntity.ok(investmentRequestService.rejectInvestmentRequest(id));
    }

    @PutMapping("/{id}/escalate")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<InvestmentResponseDto> escalateInvestmentRequest(@PathVariable Long id) {
        return ResponseEntity.ok(investmentRequestService.escalateInvestmentRequest(id));
    }
}
